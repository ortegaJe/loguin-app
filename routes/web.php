<?php

use App\Http\Controllers\CargoController;
use App\Http\Controllers\CargoPerfilController;
use App\Http\Controllers\DropdownController;
use App\Http\Controllers\GlpiAuthController;
use App\Http\Controllers\InfraCredentialController;
use App\Http\Controllers\LoguinCredentialController;
use App\Http\Controllers\LoguinTicketStoreController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\SolicitudController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
        return view('auth.loguin');
    }
);

Route::middleware(['auth:glpi', 'profile:SUPER_ADMIN|CONTRATACION'])->group(function () {
    Route::get('loguin/formulario', [DropdownController::class, 'index']);
    Route::post('fetchSedes', [DropdownController::class, 'fetchSedes']);
    Route::post('fetchTipoCargoSede', [DropdownController::class, 'fetchTipoCargoSede']);
    Route::post('fetchCargoSede', [DropdownController::class, 'fetchCargoSede']);
    Route::post('fetchCargoAppPerfil', [DropdownController::class, 'fetchCargoAppPerfil']);
    Route::post('fetchSedesAdicionales', [DropdownController::class, 'fetchSedesAdicionales']);
    Route::get('fetchEspecialidades', [DropdownController::class, 'fetchEspecialidades']);
    Route::get('fetchDataIdentificacionLoguin', [DropdownController::class, 'fetchDataIdentificacionLoguin']);
    Route::get('fetchDataAutoCompleteLoguin', [DropdownController::class, 'fetchDataAutoCompleteLoguin']);

    Route::post('storeLoguinTicket', [LoguinTicketStoreController::class, 'storeLoguinTicket']);

    Route::get('loguin/solicitudes', [SolicitudController::class, 'index']);
    Route::get('getUsuariosConSolicitudes', [SolicitudController::class, 'getUsuariosConSolicitudes']);
});

Route::middleware(['auth:glpi', 'profile:SUPER_ADMIN|CONTRATACION|ANALISTA_APP|INFRAESTRUCTURA'])->group(function () {
    Route::post('fetchSolicitudLoguin', [SolicitudController::class, 'fetchSolicitudLoguin']);
    Route::post('fetchSolicitudInfra', [SolicitudController::class, 'fetchSolicitudInfra']);
});

Route::middleware(['auth:glpi', 'profile:SUPER_ADMIN|ANALISTA_APP'])->group(function () {
    Route::get('loguin/aplicaciones/solicitudes', [SolicitudController::class, 'getRequestLoguin'])->name('loguin.app');
    Route::get('loguin/aplicaciones/solicitud/registrar/{id}', [LoguinCredentialController::class, 'registerCredential'])->name('register.loguin.app');
    Route::get('fetchDataLoguin/{id}', [LoguinCredentialController::class, 'fetchDataLoguin']);
    Route::post('storeLoguin', [LoguinCredentialController::class, 'storeLoguin']);
    Route::get('getLoguins/aplicaciones/{id}', [LoguinCredentialController::class, 'getLoguins']);
    Route::get('loguin/cargos', [CargoController::class, 'index']);
    Route::get('fetchCargoList', [CargoController::class, 'fetchCargoList']);
    Route::get('getPermisosCargo', [CargoController::class, 'getPermisosCargo']);
    Route::post('storeCargo', [CargoController::class, 'storeCargo']);
    Route::put('editCargo/{id}', [CargoController::class, 'editCargo']);
    Route::put('activateCargo/{id}', [CargoController::class, 'activateCargo']);
    Route::put('inactivateCargo/{id}', [CargoController::class, 'inactivateCargo']);
    Route::get('loguin/perfiles', [PerfilController::class, 'index']);
    Route::get('fetchPerfilList', [PerfilController::class, 'fetchPerfilList']);
    Route::get('getAplicaciones', [PerfilController::class, 'getAplicaciones']);
    Route::post('storePerfil', [PerfilController::class, 'storePerfil']);
    Route::get('getPerfilesApp', [PerfilController::class, 'getPerfilesApp']);
    Route::put('editPerfilApp/{id}', [PerfilController::class, 'editPerfilApp']);
    Route::put('activatePerfil/{id}', [PerfilController::class, 'activatePerfil']);
    Route::put('inactivatePerfil/{id}', [PerfilController::class, 'inactivatePerfil']);
    Route::get('loguin/asignacion-perfiles', [CargoPerfilController::class, 'index']);
    Route::post('storeCargoPerfil', [CargoPerfilController::class, 'storeCargoPerfil']);
    Route::get('getSedes', [CargoPerfilController::class, 'getSedes']);
    Route::get('getAppPerfiles', [CargoPerfilController::class, 'getAppPerfiles']);
});    

Route::middleware(['auth:glpi', 'profile:SUPER_ADMIN||INFRAESTRUCTURA'])->group(function () {
    Route::get('loguin/infraestructura/solicitudes', [SolicitudController::class, 'getRequestLoguinInfra'])->name('loguin.infra');
    Route::get('loguin/infraestructura/solicitud/registrar/{id}', [InfraCredentialController::class, 'registerCredential'])->name('register.loguin.infra');
    Route::get('fetchDataLoguinInfra/{id}', [InfraCredentialController::class, 'fetchDataLoguinInfra']);
    Route::post('storeLoguinInfra', [InfraCredentialController::class, 'storeLoguinInfra']);
    Route::get('getLoguins/infraestructura/{id}', [InfraCredentialController::class, 'getLoguinInfra']);
});

Route::match(['get', 'post'], '/login',  [GlpiAuthController::class, 'login'])->name('login');
Route::match(['get', 'post'], '/logout', [GlpiAuthController::class, 'logout'])->name('logout');

Route::get('query', function () {
    $glpi = DB::table('glpi_locations')->where('sw_regional', 1)->get();
    return response()->json($glpi);
});