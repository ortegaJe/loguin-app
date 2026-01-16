<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CargoController extends Controller
{
    public function index() {
        return view('cargo.index');
    }

    public function fetchCargoList() {
        $data = DB::table('loguin_cargo as a')
            ->join('loguin_tipo_cargo as b', 'b.id', 'a.tipocargo_id')
            ->select([
                'a.id as cargo_id',
                'a.name as nombre',
                'b.id as tipo_cargo_id',
                'b.name as nombre_tipo_cargo',
                'a.sw_correo as correo',
                'a.sw_dominio as dominio',
                'a.sw_vpn as vpn',
                'a.estado',
                'a.fecha_creacion',
                ])
            ->orderBy('a.name')
            ->get();

        return response()->json([
            'cargos' => $data,
            'message' => 'Lista de cargos obtenida exitosamente',
            'status' => 200,
        ], 200);
    }

    public function getSedes() {
        $data['sedes'] = DB::table('glpi_locations')->where('sw_regional', 0)->orderBy('name')->get(['name', 'id']);
        return response()->json($data);
    }

    public function storeCargo(Request $request) {
        // ver en consola el request recibido
        //error_log(__LINE__ . __METHOD__ . ' data --->' .var_export( $request->all(), true));

        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate([
                'nombre_cargo' => 'required|string',
                'tipo_cargo' => 'required|array',
                'opciones_infra' => 'nullable|array',
            ]);

            $cargo = $validatedData['nombre_cargo'];
            $tipoCargo = $validatedData['tipo_cargo'] ?? [];
            $opcionesInfra = $validatedData['opciones_infra'] ?? [];

            $cargo = $this->createCargo($cargo, $tipoCargo, $opcionesInfra);

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

    public function storeCargoPerfiles(Request $request) {
        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
        
        try {
            $validatedData = $request->validate([
                'cargo' => 'required|string',
                'tipo_cargo' => 'required|integer',
                'opcionesInfra' => 'nullable|array',
                'sedes' => 'required|array',
            ]);

            $cargo = $validatedData['cargo'];
            $tipoCargoId = $validatedData['tipo_cargo'];
            $opcionesInfra = $validatedData['opcionesInfra'] ?? [];
            $sedes = $validatedData['sedes'] ?? [];

            $cargoId = $this->createCargo($cargo, $tipoCargoId, $opcionesInfra);

            $this->createTipoCargoSede($tipoCargoId, $sedes, $cargoId);

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

    private function createCargo($cargo, $tipoCargo, $opcionesInfra) {
        //error_log(__LINE__ . __METHOD__ . ' data --->' .var_export($tipoCargo[0]['tipo_cargo_id'], true));
        // Inicializar los valores de infraestructura como 0 por defecto
        $swCorreo = 0;
        $swDominio = 0;
        $swVpn = 0;
        $tipoCargoId = $tipoCargo[0]['tipo_cargo_id'];

        // Verificar si las opciones de infraestructura incluyen alguna de estas características
        foreach ($opcionesInfra as $infra) {
            $nombre = strtolower($infra['name']);

            if (strpos($nombre, 'correo') !== false) {
                $swCorreo = 1;
            }
            if (strpos($nombre, 'dominio') !== false) {
                $swDominio = 1;
            }
            if (strpos($nombre, 'vpn') !== false) {
                $swVpn = 1;
            }
        }

        //error_log(__LINE__ . __METHOD__ . ' ID usuario creado --->' ."swCorreo: " . $swCorreo . ", swDominio: " . $swDominio . ", swVpn: " . $swVpn);

        return DB::table('loguin_cargo')->insertGetId([
            'name' => $cargo,
            'tipocargo_id' => $tipoCargoId,
            'sw_correo' => $swCorreo,
            'sw_dominio' => $swDominio,
            'sw_vpn' => $swVpn,
            'fecha_creacion' => now('America/Bogota'),
        ]);
    }

    private function createTipoCargoSede($tipoCargoId, $sedes, $cargoId) {
        foreach ($sedes as $sedeId) {
            DB::table('loguin_rel_tipo_cargo_sede')->insert([
                'tipocargo_id' => $tipoCargoId,
                'sede_id' => $sedeId,
                'cargo_id' => $cargoId,
                'fecha_creacion' => now('America/Bogota'),
            ]);
        }
    }

    public function getOpcionesCargoInfra(Request $request) {
        $cargoId = $request->query('cargoId');

        if (!$cargoId) {
            return response()->json([
                'message' => 'ID de cargo no proporcionado',
            ], 400);
        }
        $opcionesInfra = DB::table('loguin_cargo')
            ->where('id', $cargoId)
            ->select('id as cargo_id', 'name', 'sw_correo', 'sw_dominio', 'sw_vpn')
            ->first();

        if (!$opcionesInfra) {
            return response()->json([
                'message' => 'Cargo no encontrado',
            ], 404);
        }

        return response()->json([
            'opcionesInfra' => $opcionesInfra,
            'message' => 'Opciones de infraestructura obtenidas exitosamente',
            'status' => 200,
        ], 200);
    }
}
