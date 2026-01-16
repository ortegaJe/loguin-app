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
        <div class="row">
            <div class="col-md-6 col-xl-3">
                <a class="block block-rounded block-link-shadow" href="javascript:void(0)" id="newCargoBtn">
                    <div class="block-content block-content-full block-sticky-options">
                        <div class="block-options">
                            <div class="block-options-item">
                                <i class="fa fa-archive fa-2x text-success-light"></i>
                            </div>
                        </div>
                        <div class="py-3 text-center">
                            <div class="fs-2 fw-bold mb-0 text-success">
                                <i class="fa fa-plus"></i>
                            </div>
                            <div class="fs-sm fw-semibold text-uppercase text-muted">Nuevo Cargo</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="content-heading d-flex justify-content-between align-items-center">
            <span>
                Lista de Cargos<small class="d-none d-sm-inline"></small>
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
        <!-- Modal Nuevo Cargo -->
        <div class="modal fade" id="newCargoModal" tabindex="-1" aria-labelledby="newCargoModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-popout modal-lg" role="document">
                <div class="modal-content">
                    <div class="block block-rounded shadow-none mb-0">
                        <div class="modal-header text-end border-bottom">
                            <h5 class="modal-title" id="newCargoModalTitle">Crear Nuevo Cargo</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="newCargoForm">
                            <div class="block-content"></div>
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
        <!-- END Modal Nuevo Cargo -->
        <!-- Modal Actualizar Permisos Cargo -->
        <div class="modal fade" id="editCargoModal" tabindex="-1" aria-labelledby="editCargoModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-popout modal-lg" role="document">
                <div class="modal-content">
                    <div class="block block-rounded shadow-none mb-0">
                        <div class="modal-header text-end border-bottom">
                            <input type="text" id=cargoId hidden>
                            <h5 class="modal-title" id="editCargoModalTitle"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <form id="editCargoModalForm">
                            <div class="block-content"></div>
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
        <!-- END Modal Actualizar Permisos Cargo -->
    </div>
@endsection
