<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CargoPerfilController extends Controller
{
    public function index() {

        $cargos = DB::table('loguin_cargo as a')
        ->join('loguin_tipo_cargo as b', 'b.id', 'a.tipocargo_id')
        ->where('a.estado', 1)
        ->where('b.estado', 1)
        ->orderBy('a.name')
        ->get(['a.id', DB::raw("CONCAT(a.name, ' - ', b.name) AS name"), 'a.tipocargo_id']);

        return view('cargo-perfil.create', compact('cargos'));
    }

    public function getAppPerfiles() {
        $data['app_perfiles'] = DB::table('loguin_aplicaciones as a')
                                    ->join('loguin_perfil as b', 'b.aplicacion_id', 'a.id')
                                    ->where('a.estado', 1)
                                    ->orderBy('a.name')
                                    ->get([DB::raw("UPPER(CONCAT(a.name, ' - ', b.name)) AS perfil"), 'a.id as aplicacion_id', 'b.id as perfil_id']);
        return response()->json($data);
    }

    public function getSedes() {
        $data['sedes'] = DB::table('glpi_locations')->where('sw_regional', 0)->orderBy('name')->get(['name', 'id']);
        return response()->json($data);
    }

    public function storePerfil(Request $request) {
        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate([
                'tipo_cargo_id' => 'required|integer',
                'cargo' => 'required|integer',
                'app_perfiles' => 'required|array',
                'sedes' => 'required|array',
            ]);

            $tipoCargoId = $validatedData['tipo_cargo_id'];
            $cargo = $validatedData['cargo'];
            $appPerfiles = $validatedData['app_perfiles'];
            $sedes = $validatedData['sedes'];

            $this->createTipoCargoSede($tipoCargoId, $cargo, $sedes);

            $this->createCargoSedesPerfil($cargo, $sedes, $appPerfiles);

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

    private function createTipoCargoSede($tipoCargoId, $cargoId, $sedes) {
        foreach ($sedes as $sede) {
            DB::table('loguin_rel_tipo_cargo_sede')->insert([
                'tipocargo_id' => $tipoCargoId,
                'sede_id' => $sede,
                'cargo_id' => $cargoId,
                'fecha_creacion' => now('America/Bogota'),
            ]);
        }
    }

    private function createCargoSedesPerfil($cargo, $sedes, $appPerfiles) {
        $data = [];

        foreach ($sedes as $sede) {
            foreach ($appPerfiles as $perfil) {
                $data[] = [
                    'cargo_id'       => $cargo,
                    'sede_id'        => $sede,
                    'perfil_id'      => $perfil,
                    'fecha_creacion' => now('America/Bogota'),
                ];
            }
        }

        DB::table('loguin_rel_cargo_sede')->insert($data);
    }
}
