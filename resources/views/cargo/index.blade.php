@extends('layouts.backend')

@section('title', 'Cargos')

@section('css')
    <link rel="stylesheet" href="{{ asset('js/plugins/datatables-bs5/css/dataTables.bootstrap5.min.css') }}">
    <link rel="stylesheet" href="{{ asset('js/plugins/datatables-buttons-bs5/css/buttons.bootstrap5.min.css') }}">
    <link rel="stylesheet" href="{{ asset('js/plugins/datatables-responsive-bs5/css/responsive.bootstrap5.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/js/plugins/sweetalert2/sweetalert2.min.css') }}">
@endsection

@section('js')
    <script src="{{ asset('js/plugins/datatables/dataTables.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-bs5/js/dataTables.bootstrap5.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-responsive-bs5/js/responsive.bootstrap5.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons-bs5/js/buttons.bootstrap5.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons-jszip/jszip.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons-pdfmake/pdfmake.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons-pdfmake/vfs_fonts.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons/buttons.print.min.js') }}"></script>
    <script src="{{ asset('js/plugins/datatables-buttons/buttons.html5.min.js') }}"></script>
    <script src="{{ asset('/js/plugins/sweetalert2/sweetalert2.min.js') }}"></script>
    <style>
        #solicitudesTable_wrapper {
            position: relative;
        }
    </style>

    @vite(['resources/js/pages/datatables.cargos.js'])
@endsection

@section('content')
    <div class="content">
        <div class="content-heading d-flex justify-content-between align-items-center">
            <span>
                Solicitudes <small class="d-none d-sm-inline">Aplicaciones</small>
            </span>
        </div>
        <!-- Partial Table -->
        <div class="block block-rounded" id="datatable-wrapper">
            <div class="block-content block-content-full">
                <table class="table table-borderless table-hover table-striped table-vcenter js-dataTable-full"
                    id="solicitudesTable">
                    <thead class="text-end border-bottom">
                        <tr>
                            <th class="d-none d-md-table-cell">#</th>
                            <th class="text-center">Nombre</th>
                            <th class="text-center d-none d-sm-table-cell">Tipo</th>
                            <th class="d-none d-md-table-cell" style="width: 5%;">fecha</th>
                            <th class="text-center">estado</th>
                            <th class="text-center" style="width: 100px;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <!-- END Partial Table -->
        <!-- Modal Loguin -->
        <div class="modal fade" id="solicitudModal" tabindex="-1" aria-labelledby="solicitudModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-popout modal-md" role="document">
                <div class="modal-content">
                    <div class="block block-rounded shadow-none mb-0">
                        <div class="modal-header text-end border-bottom">
                            <input type="text" id=cargoIdModal hidden>
                            <h5 class="modal-title" id="solicitudModalTitle"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="OpcionesInfraForm">
                            <div class="block-content">
                                {{-- <div class="row g-3" id="OpcionesInfraContent">
                                    <div class="col-6 col-sm-4">
                                        <div class="form-check form-block">
                                            <input type="checkbox" class="form-check-input" id="correo-institucional"
                                                name="correo-institucional">
                                            <label class="form-check-label bg-body-light text-center"
                                                for="correo-institucional" data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-original-title="Correo institucional">
                                                <i class="fa fa-envelope fa-2x text-muted me-1"></i>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-4">
                                        <div class="form-check form-block">
                                            <input type="checkbox" class="form-check-input" id="usuario-dominio"
                                                name="usuario-dominio">
                                            <label class="form-check-label bg-body-light text-center" for="usuario-dominio"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-original-title="Usuario de dominio">
                                                <i class="fa fa-user-circle fa-2x text-muted me-1"></i>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-6 col-sm-4">
                                        <div class="form-check form-block">
                                            <input type="checkbox" class="form-check-input" id="vpn" name="vpn">
                                            <label class="form-check-label bg-body-light text-center" for="vpn"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-original-title="VPN">
                                                <i class="fa fa-globe fa-2x text-muted me-1"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div> --}}
                            </div>
                            <div class="block-content block-content-full block-content-sm text-end border-top">
                                <button type="submit" class="btn btn-alt-success">
                                    Guardar
                                </button>
                                <button type="button" class="btn btn-alt-secondary" data-bs-dismiss="modal">
                                    Cerrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- END Modal Loguin -->
    </div>
@endsection
