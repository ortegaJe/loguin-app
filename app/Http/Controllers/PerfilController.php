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

        return view('perfil.create', compact('cargos'));
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
                'cargo' => 'required|integer',
                'perfil' => 'required|string',
                'aplicaciones' => 'required|array',
                'sedes' => 'required|array',
            ]);

            $cargo = $validatedData['cargo'];
            $perfil = $validatedData['perfil'];
            $aplicaciones = $validatedData['aplicaciones'];
            $sedes = $validatedData['sedes'];

            $perfilId = $this->createPerfil($perfil, $aplicaciones);

            $this->createSedesCargoPerfil($cargo, $sedes, $perfilId);

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

    private function createPerfil($perfil, $aplicaciones) {
        foreach ($aplicaciones as $aplicacion) {
            return DB::table('loguin_perfil')->insertGetId([
                'name' => $perfil,
                'aplicacion_id' => $aplicacion,
                'fecha_creacion' => now('America/Bogota'),
            ]);
        }
    }

    private function createSedesCargoPerfil($cargo, $sedes, $perfilId) {
        foreach ($sedes as $sede) {
            DB::table('loguin_rel_cargo_sede')->insert([
                'cargo_id' => $cargo,
                'sede_id' => $sede,
                'perfil_id' => $perfilId,
                'fecha_creacion' => now('America/Bogota'),
            ]);
        }
    }
}
