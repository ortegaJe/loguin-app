@extends('layouts.backend')

@section('title', 'Solicitudes')

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

    @vite(['resources/js/pages/datatables.solicitudes.credenciales.js'])
@endsection

@section('content')
    <div class="content">
        <div class="row g-sm" id="countTicketCard">
            <div class="col-6 col-md-4 col-xl-2">
                <a class="block block-rounded block-link-shadow block-mode-loading-refresh block-mode-loading" href="javascript:void(0)">
                    <div class="block-content block-content-full">
                        <div class="py-3 text-center">
                            <div class="mb-3"><i class="far fa-circle fa-4x text-success"></i></div>
                            <div class="fs-3 fw-semibold">0</div>
                            <div class="fs-sm fw-semibold text-uppercase text-muted">En Curso</div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
                <a class="block block-rounded block-link-shadow  block-mode-loading-refresh block-mode-loading" href="javascript:void(0)">
                    <div class="block-content block-content-full">
                        <div class="py-3 text-center">
                            <div class="mb-3"><i class="far fa-comment fa-4x text-secondary"></i></div>
                            <div class="fs-3 fw-semibold">0</div>
                            <div class="fs-sm fw-semibold text-uppercase text-muted">Con Respuesta</div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
                <a class="block block-rounded block-link-shadow  block-mode-loading-refresh block-mode-loading" href="javascript:void(0)">
                    <div class="block-content block-content-full">
                        <div class="py-3 text-center">
                            <div class="mb-3"><i class="fa fa-check fa-4x text-info"></i></div>
                            <div class="fs-3 fw-semibold">0</div>
                            <div class="fs-sm fw-semibold text-uppercase text-muted">Cerrados</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
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
                            <th class="text-center">Ticket</th>
                            <th class="text-center d-none d-sm-table-cell">Estado</th>
                            <th class="d-none d-md-table-cell" style="width: 5%;">Fecha</th>
                            <th>Documento</th>
                            <th class="d-none d-md-table-cell" style="width: 30%;">Nombre Completo</th>
                            {{-- <th class="d-none d-md-table-cell"th>Cargo</th> --}}
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
            <div class="modal-dialog modal-dialog-popout modal-lg" role="document">
                <div class="modal-content">
                    <div class="block block-rounded shadow-none mb-0">
                        <div class="modal-header text-end border-bottom">
                            <h5 class="modal-title" id="solicitudModalLabel">Detalle de Solicitud</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="block-content fs-md">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="block block-rounded block-bordered">
                                        <div class="block-header">
                                            <h3 class="block-title"><i class="fa fa-user fa-2x text-muted"></i></h3>
                                        </div>
                                        <div class="block-content">
                                            <p class="mb-1">
                                                <strong>Documento:</strong> <span id="modal-documento"></span>
                                            </p>
                                            <p class="mb-1">
                                                <strong>Nombre Completo:</strong> <span id="modal-nombre"></span>
                                            </p>
                                            <p>
                                                <strong>Email:</strong> <span id="modal-email"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <a class="block block-rounded block-bordered" id="modal-ticket"
                                        href="javascript:void(0)">
                                        <div class="block-header">
                                            <h3 class="block-title"><i class="fa fa-ticket fa-2x text-muted"></i></h3>
                                        </div>
                                        <div class="block-content">
                                            <p class="mb-1">
                                                <strong>Ticket Mesa de Servicio:</strong> <span
                                                    id="modal-ticket-numero"></span>
                                            </p>
                                            <p>
                                                <strong>Fecha de Creación:</strong> <span id="modal-fecha"></span>
                                            </p>
                                        </div>
                                    </a>
                                </div>
                                <div class="col-sm-6">
                                    <div class="block block-rounded block-bordered">
                                        <div class="block-header">
                                            <h3 class="block-title"><i class="fa fa-building fa-2x me-1 text-muted"></i>
                                            </h3>
                                        </div>
                                        <div class="block-content">
                                            <p class="mb-1">
                                                <strong>Zonal:</strong> <span id="modal-zonal"></span>
                                            </p>
                                            <p>
                                                <strong>Sede:</strong> <span id="modal-sede"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <div class="block block-rounded block-bordered">
                                        <div class="block-header">
                                            <h3 class="block-title"><i class="fa fa-cogs fa-2x me-1 text-muted"></i>
                                                Aplicaciones y Perfiles Solicitados
                                            </h3>
                                        </div>
                                        <div class="block-content">
                                            <ul class="list-group push" id="modal-aplicaciones-perfiles"></ul>
                                            <h6 id="title-especialidad" hidden><i
                                                    class="fa fa-book-medical fa-2x me-2 text-muted"></i>Especialidad</h6>
                                            <ul class="list-group push" id="modal-especialidad-usuario" hidden></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <div class="block block-rounded block-bordered">
                                        <div class="block-header">
                                            <h3 class="block-title"><i class="fa fa-circle-info fa-2x text-muted"></i>
                                            </h3>
                                        </div>
                                        <div class="block-content">
                                            <p>
                                                <strong>Observación:</strong> <span id="modal-observacion"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="block-content block-content-full block-content-sm text-end border-top">
                            <button type="button" class="btn btn-alt-secondary" data-bs-dismiss="modal">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END Modal Loguin -->
    </div>
@endsection
