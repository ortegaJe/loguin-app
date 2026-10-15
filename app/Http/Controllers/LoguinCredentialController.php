<?php

namespace App\Http\Controllers;

use App\Enums\UserProfiles;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoguinCredentialController extends Controller
{
    public function index()
    {
        return view('loguin-credenciales.index');
    }

    public function registerCredential($id)
    {
        $solicitud = DB::table('loguin_solicitud')
                        ->where('id', $id)
                        ->first(['id as solicitud', 'ticket_id']);

        return view('loguin-credenciales.create', compact('solicitud'));
    }

    public function fetchDataLoguin($id)
    {
        $solicitudId = $id;

        $usuario = $this->getUsuario($solicitudId);
        $loguinSolicitud = $this->getLoguinSolicitud($solicitudId);
        $especialidadUsuario = $this->getEspecialidadUsuario($solicitudId);
        $hasLoguin = $this->hasLoguins($solicitudId);
        $sedesAdicionales = $this->getSedesAdicionales($solicitudId);

        if ($usuario->isEmpty() && $loguinSolicitud->isEmpty() && $especialidadUsuario->isEmpty()) {
            return response()->json(['message' => 'No se encontró información'], 404);
        }
    
        return response()->json([
            'usuario' => $usuario,
            'loguin_solicitud' => $loguinSolicitud,
            'especialidad_usuario' => $especialidadUsuario ?? null,
            'sedes_adicionales' => $sedesAdicionales ?? null,
            'has_loguin' => $hasLoguin ?? null,
        ], 200);
    }

    private function getUsuario(int $solicitudId)
    {
        return DB::table('loguin_solicitud as a')
            ->join('loguin_usuarios as b', 'b.id', 'a.usuario_id')
            ->join('glpi_locations as c', 'c.id', 'a.sede_id')
            ->join('loguin_tipo_identificacion as d', 'd.id', 'b.tipoidentificacion_id')
            ->join('loguin_cargo as e', 'e.id', 'a.cargo_id')
            ->join('glpi_locations as f', 'f.id', 'c.locations_id')
            ->where('a.id', $solicitudId)
            ->select([
                'a.id as solicitud_id',
                'b.id as usuario_id',
                DB::raw("CONCAT(d.abreviatura) as tipo_identificacion"),
                DB::raw("CONCAT(b.identificacion) as identificacion"),
                DB::raw("UPPER(CONCAT(b.nombres, ' ', b.apellidos)) as nombreCompleto"), 
                'b.email',
                DB::raw("DATE_FORMAT(b.fecha_nacimiento, '%m-%d-%Y') as fechaNacimiento"),
                'f.name as zonal',
                'c.name as sede',
                DB::raw("UPPER(e.name) as cargo"),
                'a.ticket_id',
                'a.observaciones',
                DB::raw("DATE_FORMAT(a.fecha_creacion, '%d/%m%/%Y') as fecha_creacion"),
                DB::raw("(
                    SELECT 
                        CASE 
                            WHEN c.status = 2 AND d.items_id IS NULL THEN 'success'
                            WHEN c.status = 2 AND c.id = d.items_id THEN 'secondary'
                            WHEN c.status >= 5 THEN 'info'
                            ELSE 'danger'
                        END 
                    FROM glpi_tickets c
                    LEFT JOIN glpi_itilfollowups d ON d.items_id = c.id
                    WHERE c.id = a.ticket_id
                    LIMIT 1
                ) AS status_color"),
                DB::raw("(
                    SELECT 
                        CASE 
                            WHEN c.status = 2 AND d.items_id IS NULL THEN 'far fa-circle'
                            WHEN c.status = 2 AND c.id = d.items_id THEN 'far fa-comment'
                            WHEN c.status >= 5 THEN 'fa fa-check'
                            ELSE 'far fa-circle-xmark'
                        END 
                    FROM glpi_tickets c
                    LEFT JOIN glpi_itilfollowups d ON d.items_id = c.id
                    WHERE c.id = a.ticket_id
                    LIMIT 1
                ) AS status_icon"),
                DB::raw("(
                    SELECT 
                        CASE 
                            WHEN c.status = 2 AND d.items_id IS NULL THEN 'en curso'
                            WHEN c.status = 2 AND c.id = d.items_id THEN 'respuesta'
                            WHEN c.status >= 5 THEN 'solucionado'
                            ELSE 'desconocido'
                        END
                    FROM glpi_tickets c
                    LEFT JOIN glpi_itilfollowups d ON d.items_id = c.id
                    WHERE c.id = a.ticket_id
                    LIMIT 1
                ) AS status_title")
            ])->get();
    }
    
    private function getLoguinSolicitud($solicitudId)
    {
        return DB::table('loguin_solicitud as a')
            ->join('loguin_solicitud_detalle as b', 'b.solicitud_id', 'a.id')
            ->join('loguin_aplicaciones as c', 'c.id', 'b.aplicacion_id')
            ->join('loguin_perfil as d', 'd.id', 'b.perfil_id')
            ->where('b.solicitud_id', $solicitudId)
            ->select([
                'a.id as solicitud_id',
                'c.is_coraza',
                'b.aplicacion_id',
                'c.name as aplicacion',
                'b.perfil_id',
                DB::raw("UPPER(d.name) as perfil"),
            ])->get();
    }

    private function getEspecialidadUsuario($solicitudId)
    {
        return DB::table('loguin_especialidad_usuario as a')
            ->join('loguin_especialidades as b', 'b.id', 'a.especialidad_id')
            ->join('loguin_solicitud as c', 'c.id', 'a.solicitud_id')
            //->where('a.usuario_id', $userId)
            ->where('a.solicitud_id', $solicitudId)
            ->select('b.name as especialidad')
            ->get();
    }

    private function getSedesAdicionales($solicitudId)
    {
        $sedesAdicionales = DB::table('loguin_solicitud')
            ->where('id', $solicitudId)
            ->first('sedes_adicionales');

            if (!$sedesAdicionales || $sedesAdicionales == '') {
                return null;
            }

            $sedesJson = $sedesAdicionales->sedes_adicionales;

            $sedes = json_decode($sedesJson, JSON_PRETTY_PRINT);
            //error_log(__LINE__ . __METHOD__ . ' json --->' .var_export($sedesJson, true));

            return $sedes;
    }

    public function getLoguins($solicitudId)
    {
        return DB::table('loguin_solicitud as a')
        ->join('loguin_solicitud_detalle as b', 'b.solicitud_id', 'a.id')
        ->join('loguin_aplicaciones as c', 'c.id', 'b.aplicacion_id')
        ->join('loguin_perfil as d', 'd.id', 'b.perfil_id')
        ->where('b.solicitud_id', $solicitudId)
        ->select([
            'a.id as solicitud_id',
            'b.aplicacion_id',
            'b.perfil_id',
            DB::raw("UPPER(CONCAT(c.name,' ',d.name)) as aplicacion_perfil"),
            'b.usuario_loguin',
            'b.password_loguin',
            'b.mipres',
            'b.ruaf',
            'b.agendas_ocultas',
        ])->get();
    }

    private function hasLoguins($solicitudId)
    {
        return DB::table('loguin_solicitud as a')
        ->join('loguin_solicitud_detalle as b', 'b.solicitud_id', 'a.id')
        ->join('loguin_aplicaciones as c', 'c.id', 'b.aplicacion_id')
        ->join('loguin_perfil as d', 'd.id', 'b.perfil_id')
        ->where('b.solicitud_id', $solicitudId)
        ->select([
            'a.id as solicitud_id',
            'b.aplicacion_id',
            'b.perfil_id',
            DB::raw("UPPER(CONCAT(c.name,' ',d.name)) as aplicacion_perfil"),
            'b.usuario_loguin',
            'b.password_loguin',
            'b.mipres',
            'b.ruaf',
            'b.agendas_ocultas'
        ])->get();
    }

    public function getCountTickets()
    {
        // Obtener el primer y último día de la semana actual
        $carbon = CarbonImmutable::now()->locale('es');
        $primerDiaSemana = $carbon->startOfWeek()->format('Y-m-d H:i:s');
        $ultimoDiaSemana = $carbon->endOfWeek()->format('Y-m-d H:i:s');

        $countByStatus = DB::table('loguin_solicitud as b')
        ->leftJoin('glpi_tickets as c', 'c.id', 'b.ticket_id')
        ->leftJoin('glpi_itilfollowups as d', 'd.items_id', 'c.id')
        ->whereBetween('c.date_creation', [$primerDiaSemana, $ultimoDiaSemana])
        ->selectRaw("
            COUNT(DISTINCT CASE 
                WHEN c.status = 2 
                THEN c.id
            END) AS en_curso,

            COUNT(DISTINCT CASE 
                WHEN c.status = 2 
                    AND c.id = d.items_id 
                THEN c.id
            END) AS respuesta,

            COUNT(DISTINCT CASE 
                    WHEN c.status >= 5 
                    THEN c.id
            END) AS cerrados
        ", )
        ->first();
    
        $countByTicketCloseUser = DB::table('loguin_solicitud as a')
        ->leftJoin('loguin_solicitud_detalle as b', 'b.solicitud_id', 'a.id')
        ->leftJoin('glpi_tickets as c', 'c.id', 'a.ticket_id')
        ->leftJoin('glpi_users as d', 'd.id', 'b.users_id_recipient')
        ->leftJoin('glpi_profiles_users as e', 'e.users_id', 'c.users_id_lastupdater')
        ->where('e.profiles_id', UserProfiles::ANALISTA_APP->value)
        ->whereBetween('c.date_creation', [$primerDiaSemana, $ultimoDiaSemana])
        ->select(
            'd.name as analista_app',
            'd.id as user_id',
            DB::raw("
                COUNT(DISTINCT CASE
                    WHEN c.status >= 5 THEN a.ticket_id
                    ELSE NULL
                END) as cerrados
            ")
        )
        ->groupBy('d.name', 'd.id')
        ->orderBy('cerrados', 'desc')
        ->limit(2)
        ->get();
    
        return response()->json([
            'message' => 'ok',
            'status' => 200,
            'countByStatus' => $countByStatus,
            //'countByTicketCloseUser' => $countByTicketCloseUser,
        ]);
    }

    public function storeLoguin(Request $request)
    {
        // Iniciar una transacción para asegurar la consistencia de los datos
        DB::beginTransaction();
    
        try {
            $validatedData = $request->validate([
                'solicitud' => 'integer',
                'aplicaciones_loguin' => 'required|array',
            ]);
    
            // Datos enviados desde el frontend
            $solicitud = $validatedData['solicitud'];
            $aplicacionesLoguin = $validatedData['aplicaciones_loguin'];

            $this->registerLoguinApplications($aplicacionesLoguin, $solicitud);
            $this->closeGlpiTicket($solicitud);

            // Confirmar la transacción si todo salió bien
            DB::commit();

            return response()->json([
                'message' => 'Credenciales Login registradas correctamente.',
                'solicitud' => $solicitud,
                'ticket_status' => $this->getUsuario($solicitud) ?? null,
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

    private function registerLoguinApplications($aplicacionesLoguin, $solicitud)
    {
        $currentUser = Auth::guard('glpi')->id();

        foreach ($aplicacionesLoguin as $loguin) {
            DB::table('loguin_solicitud_detalle')
            ->where('solicitud_id', $solicitud)
            ->where('aplicacion_id', $loguin['app_id'])
            ->where('perfil_id', $loguin['perfil_id'])
            ->update([
                'users_id_recipient' => $currentUser,
                'usuario_loguin' => $loguin['usuario_loguin'],
                'password_loguin' => $loguin['password_loguin'],
                'mipres' => $loguin['mipres'],
                'ruaf' => $loguin['ruaf'],
                'agendas_ocultas' => $loguin['agendas_ocultas'],
                'fecha_creacion_loguin' => now('America/Bogota'),
            ]);
        }

        DB::table('loguin_solicitud')
            ->where('id', $solicitud)
            ->update([
                'estado' => 0, // Estado actualizado a "Cerrado"
                'fecha_cerrado' => $aplicacionesLoguin[0]['fecha_creacion_loguin'] ?? now('America/Bogota'),
            ]);
    }

    private function closeGlpiTicket(int $solicitud)
    {
        $currentUser = Auth::guard('glpi')->id();

        $ticketId = DB::table('loguin_solicitud')
            ->where('id', $solicitud)
            ->value('ticket_id');

        if ($ticketId) {

            $encodedTable = $this->buildEncodedTable($this->getLoguins($solicitud));

            DB::table('glpi_itilsolutions')->insert([
                'itemtype' => 'Ticket',
                'items_id' => $ticketId,
                'solutiontypes_id' => 0,
                'solutiontype_name' => NULL,
                'content' => $encodedTable,
                'date_creation' => now('America/Bogota'),
                'date_mod' => now('America/Bogota'),
                'date_approval' => NULL,
                'users_id' => $currentUser,
                'user_name' => NULL,
                'users_id_editor' => 0,
                'users_id_approval' => 0,
                'user_name_approval' => NULL,
                'status' => 2,
                'itilfollowups_id' => NULL
            ]);

            DB::table('glpi_tickets')
                ->where('id', $ticketId)
                ->update([
                    'status' => 5, // Estado actualizado a "Cerrado"
                    'date_mod' => now('America/Bogota'),
                    'solvedate' => now('America/Bogota'),
                    'begin_waiting_date' => now('America/Bogota'),
                    'solve_delay_stat' => $this->getSolveDelayStat($ticketId),
                    'takeintoaccount_delay_stat' => $this->getTakeIntoAccountDelayStat($ticketId),
                    'users_id_lastupdater' => $currentUser,
                ]);
        }
    }

    // Calcula el tiempo de resolución del ticket en segundos, diferencia entre la fecha de creación y la fecha de solución
    private function getSolveDelayStat(int $ticketId)
    {
        $date = Carbon::now('America/Bogota');

        $solveDate = $date->toDateTimeString();

        $getDate = DB::table('glpi_tickets')
            ->where('id', $ticketId)
            ->value('date');

        $dateCreation = new Carbon($getDate, 'America/Bogota');

        $solveDelayStat =  $dateCreation->diffInSeconds(CarbonImmutable::parse($solveDate, 'America/Bogota'));

        return $solveDelayStat;
    }

    // Calcula el tiempo de atención del ticket en segundos, diferencia entre la fecha de creación y la fecha de toma en cuenta
    // Si el ticket no tiene fecha de toma en cuenta y el tiempo de atención es 0, se actualiza la fecha de toma en cuenta con la fecha actual y se calcula el tiempo de atención
    private function getTakeIntoAccountDelayStat(int $ticketId)
    {
        $ticket = DB::table('glpi_tickets')
            ->where('id', $ticketId)
            ->first(['takeintoaccountdate', 'takeintoaccount_delay_stat']);

        $getTakeIntoAccountDate = $ticket?->takeintoaccountdate;
        $getTakeIntoAccountDelayStat = $ticket?->takeintoaccount_delay_stat;

        if ($getTakeIntoAccountDate === null && $getTakeIntoAccountDelayStat === 0) 
        {
            DB::table('glpi_tickets')
                ->where('id', $ticketId)
                ->update(['takeintoaccountdate' => now('America/Bogota')]);

            $getDate = DB::table('glpi_tickets')
                ->where('id', $ticketId)
                ->value('date');

            $dateCreation = new Carbon($getDate, 'America/Bogota');

            $getTakeIntoAccountDate = DB::table('glpi_tickets')
                ->where('id', $ticketId)
                ->value('takeintoaccountdate');

            $takeIntoAccountDelayStat = $dateCreation->diffInSeconds(CarbonImmutable::parse($getTakeIntoAccountDate, 'America/Bogota'));

             return $takeIntoAccountDelayStat;

        } else
        {
            return $getTakeIntoAccountDelayStat;
        }
    }

    private function buildEncodedTable($dataAplicacionesLoguin)
    {

        $encodedTable = '<div tabindex="0">
            <p>¡Buen día!</p>
            <p>Solicitud de creación login realizada:</p>';

        foreach ($dataAplicacionesLoguin as $appPerfil) {

            $aplicacionId = (int) $appPerfil->aplicacion_id;

            /*
            * MIPRES y RUAF
            * Se muestran como una tabla independiente:
            * APLICACION | SÍ/NO
            */
            if ($aplicacionId === 7) {

                $valorMipres = (int) $appPerfil->mipres === 1 ? 'SÍ' : 'NO';

                $encodedTable .= '
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #27363b; margin-bottom: 16px;">
                        <tbody>
                            <tr>
                                <th>
                                    ' . e($appPerfil->aplicacion_perfil) . '
                                </th>
                                <td>
                                    ' . $valorMipres . '
                                </td>
                            </tr>
                        </tbody>
                    </table>';
            }

            elseif ($aplicacionId === 8) {

                $valorRuaf = (int) $appPerfil->ruaf === 1 ? 'SÍ' : 'NO';

                $encodedTable .= '
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #27363b; margin-bottom: 16px;">
                        <tbody>
                            <tr>
                                <th>
                                    ' . e($appPerfil->aplicacion_perfil) . '
                                </th>
                                <td>
                                    ' . $valorRuaf . '
                                </td>
                            </tr>
                        </tbody>
                    </table>';
            }

            /*
            * Aplicaciones normales
            * Se muestran con usuario y contraseña.
            */
            else {

                $encodedTable .= '
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #27363b; margin-bottom: 16px;">
                        <thead>
                            <tr>
                                <th colspan="2">
                                    ' . e($appPerfil->aplicacion_perfil) . '
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th>
                                    USUARIO
                                </th>
                                <td>
                                    ' . e($appPerfil->usuario_loguin ?? '') . '
                                </td>
                            </tr>

                            <tr>
                                <th>
                                    CONTRASEÑA
                                </th>
                                <td>
                                    ' . e($appPerfil->password_loguin ?? '') . '
                                </td>
                            </tr>
                        </tbody>
                    </table>';
            }
        }

        $encodedTable .= '</div><br>';

        return $encodedTable;
    }

}
