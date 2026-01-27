<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PerfilController extends Controller
{
    public function index() {

        $cargos = DB::table('loguin_cargo as a')
        ->join('loguin_tipo_cargo as b', 'b.id', 'a.tipocargo_id')
        ->where('a.estado', 1)
        ->where('b.estado', 1)
        ->orderBy('a.name')
        ->get(['a.id', DB::raw("CONCAT(a.name, ' - ', b.name) AS name")]);

        return view('perfil.index', compact('cargos'));
    }

    public function fetchPerfilList() {
        $data = DB::table('loguin_perfil as a')
            ->join('loguin_aplicaciones as b', 'b.id', 'a.aplicacion_id')
            ->select(['a.id as perfil_id', 'a.name as nombre_perfil', 'a.estado', 'b.name as aplicacion', 'a.fecha_creacion'])
            ->get();

        return response()->json([
            'perfiles' => $data,
            'message' => 'Lista de perfiles obtenida exitosamente',
            'status' => 200,
        ], 200);
    }

    public function getAplicaciones() {
        $data['aplicaciones'] = DB::table('loguin_aplicaciones')->where('estado', 1)->orderBy('name')->get(['name', 'id']);
        return response()->json($data);
    }

    public function storePerfil(Request $request) {
        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate([
                'nombre_perfil' => 'required|string',
                'aplicacion' => 'required|integer',
            ]);

            $perfil = $validatedData['nombre_perfil'];
            $aplicacion = $validatedData['aplicacion'];

            $this->createPerfil($perfil, $aplicacion);

            DB::commit();

            return response()->json([
                'message' => 'Datos guardados exitosamente',
            ], 200);

        } catch (\Exception $e) {
            // Manejar errores y hacer rollback si es necesario
            DB::rollBack();

            return response()->json([
                'message' => 'Error al guardar los datos '.$e->getMessage(), 
                'error' => $e->getFile(), 'line '.$e->getLine(),
            ], 500);
        }
    }

    private function createPerfil($perfil, $aplicacion) {
        return DB::table('loguin_perfil')->insert([
            'name' => $perfil,
            'aplicacion_id' => $aplicacion,
            'fecha_creacion' => now('America/Bogota'),
        ]);
    }

    public function getPerfilesApp(Request $request) {
        $perfilId = $request->query('perfilId');

        if (!$perfilId) {
            return response()->json([
                'message' => 'ID de Perfil no proporcionado',
            ], 400);
        }
        $perfilApp = DB::table('loguin_perfil')
            ->where('id', $perfilId)
            ->select('id as perfil_id', 'name', 'aplicacion_id')
            ->first();

        if (!$perfilApp) {
            return response()->json([
                'message' => 'Perfil no encontrado',
            ], 404);
        }

        return response()->json([
            'perfilApp' => $perfilApp,
            'message' => 'Datos del perfil obtenidos exitosamente',
            'status' => 200,
        ], 200);
    }

    public function editPerfilApp(Request $request, $id) {
        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate([
                'nombre_perfil' => 'required|string',
                'aplicacion' => 'required|integer',
            ]);

            $perfil = $validatedData['nombre_perfil'];
            $aplicacion = $validatedData['aplicacion'];

            DB::table('loguin_perfil')
                ->where('id', $id)
                ->update([
                    'name' => $perfil,
                    'aplicacion_id' => $aplicacion,
                ]);

            DB::commit();

            return response()->json([
                'message' => 'Datos actualizados exitosamente',
            ], 200);

        } catch (\Exception $e) {
            // Manejar errores y hacer rollback si es necesario
            DB::rollBack();

            return response()->json([
                'message' => 'Error al actualizar los datos '.$e->getMessage(), 
                'error' => $e->getFile(), 'line '.$e->getLine(),
            ], 500);
        }
    }

    public function activatePerfil($id) {
        try {
            DB::table('loguin_perfil')
                ->where('id', $id)
                ->update(['estado' => 1]);

            return response()->json([
                'message' => 'Perfil activado exitosamente',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al activar el perfil '.$e->getMessage(), 
                'error' => $e->getFile(), 'line '.$e->getLine(),
            ], 500);
        }
    }

    public function inactivatePerfil($id) {
        try {
            DB::table('loguin_perfil')
                ->where('id', $id)
                ->update(['estado' => 0]);

            return response()->json([
                'message' => 'Perfil inactivado exitosamente',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al inactivar el perfil '.$e->getMessage(), 
                'error' => $e->getFile(), 'line '.$e->getLine(),
            ], 500);
        }
    }
}
