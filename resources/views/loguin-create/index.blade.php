@extends('layouts.backend')

@section('title', 'Formulario de Solicitud')

@section('css')
    <link rel="stylesheet" href="{{ asset('/js/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('/js/plugins/sweetalert2/sweetalert2.min.css') }}">
    <style>
        .checkbox-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            /* 3 columnas */
            gap: 15px;
            /* Espacio entre las columnas */
            align-items: center;
            /* Centrar verticalmente */
        }

        .form-check-inline {
            white-space: nowrap;
            /* Evita que el texto se rompa en varias líneas */
        }

        @media (max-width: 768px) {
            .checkbox-grid {
                grid-template-columns: repeat(1, 1fr);
                /* 2 columnas en pantallas más pequeñas */
            }
        }

        @media (max-width: 480px) {
            .checkbox-grid {
                grid-template-columns: repeat(1, 1fr);
                /* 1 columna en pantallas pequeñas */
            }
        }

        .multi-select {
            display: flex;
            box-sizing: border-box;
            flex-direction: column;
            position: relative;
            width: 100%;
            user-select: none;
        }

        .multi-select .multi-select-header {
            border: 1px solid #dee2e6;
            padding: 7px 30px 7px 12px;
            overflow: hidden;
            gap: 7px;
            min-height: 45px;
        }

        .multi-select .multi-select-header::after {
            content: "";
            display: block;
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
            height: 12px;
            width: 12px;
        }

        .multi-select .multi-select-header.multi-select-header-active {
            border-color: #c1c9d0;
        }

        .multi-select .multi-select-header.multi-select-header-active::after {
            transform: translateY(-50%) rotate(180deg);
        }

        .multi-select .multi-select-header.multi-select-header-active+.multi-select-options {
            display: flex;
        }

        .multi-select .multi-select-header .multi-select-header-placeholder {
            color: #65727e;
        }

        .multi-select .multi-select-header .multi-select-header-option {
            display: inline-flex;
            align-items: center;
            background-color: #f3f4f7;
            font-size: 14px;
            padding: 3px 8px;
            border-radius: 5px;
        }

        .multi-select .multi-select-header .multi-select-header-max {
            font-size: 14px;
            color: #65727e;
        }

        .multi-select .multi-select-options {
            display: none;
            box-sizing: border-box;
            flex-flow: wrap;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 999;
            margin-top: 5px;
            padding: 5px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .multi-select .multi-select-options::-webkit-scrollbar {
            width: 5px;
        }

        .multi-select .multi-select-options::-webkit-scrollbar-track {
            background: #f0f1f3;
        }

        .multi-select .multi-select-options::-webkit-scrollbar-thumb {
            background: #cdcfd1;
        }

        .multi-select .multi-select-options::-webkit-scrollbar-thumb:hover {
            background: #b2b6b9;
        }

        .multi-select .multi-select-options .multi-select-option,
        .multi-select .multi-select-options .multi-select-all {
            padding: 4px 12px;
            height: 42px;
        }

        .multi-select .multi-select-options .multi-select-option .multi-select-option-radio,
        .multi-select .multi-select-options .multi-select-all .multi-select-option-radio {
            margin-right: 14px;
            height: 16px;
            width: 16px;
            border: 1px solid #ced4da;
            border-radius: 4px;
        }

        .multi-select .multi-select-options .multi-select-option .multi-select-option-text,
        .multi-select .multi-select-options .multi-select-all .multi-select-option-text {
            box-sizing: border-box;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: inherit;
            font-size: 16px;
            line-height: 20px;
        }

        .multi-select .multi-select-options .multi-select-option.multi-select-selected .multi-select-option-radio,
        .multi-select .multi-select-options .multi-select-all.multi-select-selected .multi-select-option-radio {
            border-color: #2facb2;
            background-color: #2facb2;
        }

        .multi-select .multi-select-options .multi-select-option.multi-select-selected .multi-select-option-radio::after,
        .multi-select .multi-select-options .multi-select-all.multi-select-selected .multi-select-option-radio::after {
            content: "";
            display: inline-block;
            width: 18px;
            /* Ajusta el tamaño según sea necesario */
            height: 16px;
            /* Ajusta el tamaño según sea necesario */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            margin-right: -0.1rem;
            margin-bottom: 8px;
            /* Ajusta el margen según sea necesario */
        }

        .multi-select .multi-select-options .multi-select-option.multi-select-selected .multi-select-option-text,
        .multi-select .multi-select-options .multi-select-all.multi-select-selected .multi-select-option-text {
            color: #2facb2;
        }

        .multi-select .multi-select-options .multi-select-option:hover,
        .multi-select .multi-select-options .multi-select-option:active,
        .multi-select .multi-select-options .multi-select-all:hover,
        .multi-select .multi-select-options .multi-select-all:active {
            background-color: #f3f4f7;
        }

        .multi-select .multi-select-options .multi-select-all {
            border-bottom: 1px solid #f1f3f5;
            border-radius: 0;
        }

        .multi-select .multi-select-options .multi-select-search {
            padding: 7px 10px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            margin: 10px 10px 5px 10px;
            width: 100%;
            outline: none;
            font-size: 16px;
        }

        .multi-select .multi-select-options .multi-select-search::placeholder {
            color: #b2b5b9;
        }

        .multi-select .multi-select-header,
        .multi-select .multi-select-option,
        .multi-select .multi-select-all {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            width: 100%;
            font-size: 16px;
            color: #212529;
        }
    </style>
@endsection

@section('js')
    <script src="{{ asset('/js/plugins/select2/js/select2.full.min.js') }}"></script>
    <script src="{{ asset('/js/plugins/sweetalert2/sweetalert2.min.js') }}"></script>
    <script src="{{ asset('/js/plugins/jquery-validation/jquery.validate.min.js') }}"></script>
    <script src="{{ asset('/js/plugins/jquery-validation/additional-methods.js') }}"></script>
    <script src="{{ asset('/js/plugins/bootstrap3-typeahead.min.js') }}"></script>
    <script src="{{ asset('/js/plugins/bootstrap-notify/bootstrap-notify.min.js') }}"></script>
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    <script type="module">
        Codebase.helpersOnLoad(['jq-select2', 'jq-notify', 'jq-validation']);
    </script>

    <script type="module">
        let route = "{{ url('fetchEspecialidades') }}";

        $('#search-especialidad').typeahead({
            source: function(query, process) {
                return $.get(route, {
                    query: query
                }, function(data) {
                    return process(data);
                });
            }
        });
    </script>

    {{-- <script type="module" src="{{ asset('js/form.handler.js') }}"></script> --}}

    @vite(['resources/js/pages/form.handler.js'])
    @vite(['resources/js/pages/MultiSelect.js'])
@endsection

@section('content')
    <!-- Page Content -->
    <div class="content">
        <div class="row">
            <div class="col-lg-12">
                <form id="main-form">
                    <div class="block block-themed block-rounded">
                        <div class="block-header">
                            <h3 class="block-title">Formulario de Solicitud Loguin</h3>
                            <div class="block-options">
                                {{-- <button type="button" class="btn-block-option" data-toggle="block-option"
                                    data-action="content_toggle" hidden>
                                </button>
                                <button type="button" id="btn-refresh" class="btn-block-option" data-toggle="block-option"
                                    data-action="state_toggle" hidden>
                                    <i class="si si-refresh"></i>
                                </button> --}}
                            </div>
                        </div>
                        <div class="block-content block-content-full">
                            <div class="row">
                                <div class="col-xl-12">
                                    <div class="row mb-4">
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <select class="form-select" id="type_identity_number"
                                                    for="type_identity_number" name="type_identity_number"
                                                    style="width: 100%;">
                                                    <option selected disabled>Seleccione tipo..</option>
                                                    <!-- Required for data-placeholder attribute to work with Select2 plugin -->
                                                    @foreach ($tipos_identificacion as $data)
                                                        <option value="{{ $data->id }}">
                                                            {{ $data->abreviatura }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                                <label class="form-label" for="type_identity_number">Tipo de
                                                    documento</label>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="identity_number"
                                                    for="identity_number" name="identity_number"
                                                    onkeypress="return /[0-9]/i.test(event.key);"
                                                    placeholder="identity_number" autocomplete="off">
                                                <label class="form-label" for="identity_number">Número de documento</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="first_name" name="first_name"
                                                    for="first_name" placeholder="first_name">
                                                <label class="form-label" for="first_name">Nombres</label>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="last_name" name="last_name"
                                                    for="last_name" placeholder="last_name">
                                                <label class="form-label" for="last_name">Apellidos</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <div class="form-floating">
                                            <input type="email" class="form-control" id="email" name="email"
                                                for="email" placeholder="email">
                                            <label class="form-label" for="email">Correo</label>
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <select class="form-select" id="zonal-dropdown" name="zonal-dropdown"
                                                    for="zonal-dropdown" style="width: 100%;">
                                                    <option selected disabled>Seleccione zonal..</option>
                                                    <!-- Required for data-placeholder attribute to work with Select2 plugin -->
                                                    @foreach ($zonales as $data)
                                                        <option value="{{ $data->id }}">
                                                            {{ $data->name }}
                                                        </option>
                                                    @endforeach
                                                </select>
                                                <label class="form-label" for="zonal-dropdown">Zonal</label>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <select class="form-select" id="sede-dropdown" name="sede-dropdown"
                                                    for="sede-dropdown" style="width: 100%;" disabled>
                                                    <option></option>
                                                    <!-- Required for data-placeholder attribute to work with Select2 plugin -->
                                                </select>
                                                <label class="form-label" for="sede-dropdown">Sede</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4">
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <select class="form-select" id="tipo-cargo-dropdown"
                                                    for="tipo-cargo-dropdown" name="tipo-cargo-dropdown"
                                                    style="width: 100%;" disabled>
                                                    <option></option>
                                                    <!-- Required for data-placeholder attribute to work with Select2 plugin -->
                                                </select>
                                                <label class="form-label" for="tipo-cargo-dropdown">Tipo de cargo</label>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <select class="form-select" id="cargo-dropdown" name="cargo-dropdown"
                                                    for="cargo-dropdown" style="width: 100%;" disabled>
                                                    <option></option>
                                                    <!-- Required for data-placeholder attribute to work with Select2 plugin -->
                                                </select>
                                                <label class="form-label" for="cargo-dropdown">Cargo</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mb-4" id="row-especialidad" hidden>
                                        <div class="col-6">
                                            <div class="form-floating">
                                                <input type="text" class="form-control animated fadeIn"
                                                    id="search-especialidad" name="search-especialidad"
                                                    for="search-especialidad" placeholder="search-especialidad"
                                                    autocomplete="off">
                                                <label class="form-label" for="search-especialidad">
                                                    Buscar especialidad..
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 animated fadeIn" id="block-solicitud" hidden>
                                        <div class="block block-rounded block-transparent">
                                            <div class="block-content">
                                                <div class="mb-4" id="checkbox-row">
                                                    <label class="form-label" id="checkbox-label"></label>
                                                    <div class="checkbox-grid animated fadeIn">
                                                        <small id="checkbox-container"></small>
                                                    </div>
                                                </div>
                                                <div class="mb-2" id="checkbox-infra-row">
                                                    <label class="form-label" id="checkbox-infra-label"></label>
                                                    <div class="space-y-2 animated fadeIn" id="checkbox-infra-container">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-4 animated fadeIn" id="radio-adicion-sedes-multiples" hidden>
                                        <label class="form-label">¿Desea adicionar mas sedes al cargo?</label>
                                        <div class="space-x-2" id="radio-adicion-sedes-multiples-container"></div>
                                    </div>
                                    <div class="row push" id="row-sedes-multiple" hidden>
                                        <div class="col-lg-6">
                                            <p class="text-muted">
                                                Seleccione las sedes adicionales a las que desea que se le
                                                asigne el loguin:
                                            </p>
                                        </div>
                                        <div class="col-lg-8 col-xl-6">
                                            <div class="mb-4">
                                                <label class="text-muted" for="sedes-multiple">Adicionar sedes</label>
                                                <select id="sedes-multiple" name="sedes_multiples" multiple
                                                    data-multi-select></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-floating mb-4">
                                        <textarea class="form-control" id="observaciones" name="observaciones" style="height: 150px"
                                            placeholder="Leave a comment here"></textarea>
                                        <label class="form-label" for="observaciones">Observación..</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="block-content block-content-full block-content-sm bg-body-light text-end">
                            <button type="reset" class="btn btn-lg btn-alt-secondary js-click-ripple"
                                data-toggle="click-ripple" id="btn-reset">
                                <i class="fa fa-eraser opacity-50 me-1"></i> Limpiar
                            </button>
                            <button type="submit" class="btn btn-lg btn-alt-primary js-click-ripple"
                                data-toggle="click-ripple" id="btn-save">
                                <i class="fa fa-paper-plane opacity-50 me-1"></i> Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- END Page Content -->
@endsection
