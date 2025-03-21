import MultiSelect from './MultiSelect.js'; // Adjust the path as needed

class ApplicationFormManager {

    static initFormElements() {
        this.mainForm = document.getElementById('main-form');
        this.fechaNacimiento = document.getElementById('fecha_nacimiento');
        this.zonalDropdown = document.getElementById('zonal-dropdown');
        this.sedeDropdown = document.getElementById('sede-dropdown');
        this.tipoCargoDropdown = document.getElementById('tipo-cargo-dropdown');
        this.cargoSedeDropdown = document.getElementById('cargo-dropdown');
        this.blockElement  = document.querySelector('.block.block-rounded.block-transparent');
        this.blockSolicitud = document.getElementById('block-solicitud');
        this.rowEspecialidad = document.getElementById('row-especialidad');
        this.radioAdicionSedeMultiple = document.getElementById('radio-adicion-sedes-multiples');
        this.radioAdicionSedeMultipleContainer = document.getElementById('radio-adicion-sedes-multiples-container');
        this.rowSedeMultiple = document.getElementById('row-sedes-multiple');
        this.sedeMultiple = document.getElementById('sedes-multiple');
        this.searchEspecialidad = document.getElementById('search-especialidad');
        this.checkboxRow = document.getElementById('checkbox-row');
        this.checkboxDescLabel = document.getElementById('checkbox-label');
        this.checkboxContainer = document.getElementById('checkbox-container');
        this.checboxInfraRow = document.getElementById('checkbox-infra-row');
        this.cheboxInfraLabel = document.getElementById('checkbox-infra-label');
        this.checkboxInfraContainer = document.getElementById('checkbox-infra-container');
        this.observaciones = document.getElementById('observaciones');
        this.btnRefreshBlock = document.getElementById('btn-refresh');
        this.btnReset = document.getElementById('btn-reset');
        this.toast = Swal.mixin({
            buttonsStyling: false,
            target: '#page-container',
            customClass: {
              confirmButton: 'btn btn-primary m-1',
              cancelButton: 'btn btn-danger m-1',
              input: 'form-control'
            }
          });

        jQuery.validator.addMethod("atLeastOneChecked", function(value, element, params) {
            return jQuery(params).filter(':checked').length > 0;
        }, "Please select at least one option.");

        // Inicializar validación del formulario
        let notificationShown = false; // Variable para rastrear si la notificación ya fue mostrada

        // Init Form Validation
        jQuery('#main-form').validate({
        ignore: [],
        rules: {
            'type_identity_number': {
            required: true,
            },
            'first_name': {
            required: true,
            },
            'identity_number': {
            required: true,
            },
            'last_name': {
            required: true,
            },
            'email': {
            required: true,
            emailWithDot: true
            },
            'zonal-dropdown': {
            required: true,
            },
            'sede-dropdown': {
            required: true,
            },
            'tipo-cargo-dropdown': {
            required: true,
            },
            'cargo-dropdown': {
            required: true,
            },
            'checkbox-group': {
            atLeastOneChecked: '.checkbox-group' // Aplica la validación a los checkboxes con la clase .checkbox-group
            },
            'search-especialidad': {
            required: {
                    depends: function (element) {
                        return !jQuery(element).is(':hidden'); // La validación solo ocurre si el campo NO está oculto
                    }
                }
            },
        },
        messages: {
            'type_identity_number': {
                required: "Este campo es obligatorio",
            },
            'first_name': {
                required: "Este campo es obligatorio",
            },
            'identity_number': {
                required: "Este campo es obligatorio",
            },
            'last_name': {
                required: "Este campo es obligatorio",
            },
            'email': {
                required: "Este campo es obligatorio",
                emailWithDot: "Debe ser un correo válido"
            },
            'zonal-dropdown': {
                required: "Este campo es obligatorio",
            },
            'sede-dropdown': {
                required: "Este campo es obligatorio",
            },
            'tipo-cargo-dropdown': {
                required: "Este campo es obligatorio",
            },
            'cargo-dropdown': {
                required: "Este campo es obligatorio",
            },
            'checkbox-group': {
                atLeastOneChecked: "Debe seleccionar al menos una opción"
            },
            'search-especialidad': {
                required: "Este campo es obligatorio"
            }
        },
        errorPlacement: function(error, element) {
            // No mostrar mensajes de error junto a los checkboxes
            if (element.hasClass('checkbox-group')) {
                return;
            }
            error.insertAfter(element); // Colocar errores para otros elementos
        },
        invalidHandler: function(event, validator) {
            // Verifica si la validación falló en el grupo de checkboxes
            if (validator.errorList.some(error => error.method === "atLeastOneChecked")) {
                Codebase.helpers('jq-notify', {
                    align: 'right',
                    from: 'top',
                    type: 'danger',
                    icon: 'fa fa-exclamation-triangle me-5',
                    message: 'Debe seleccionar al menos una opción en la sección de Aplicaciones y Perfiles o Solicitudes de Infraestructura disponibles'
                });
                notificationShown = true; // Marca la notificación como mostrada
            }
        },
        success: function(label) {
            // Reinicia la variable para permitir futuras notificaciones si se arregla el error y luego vuelve a ocurrir
            notificationShown = false;
        }
    });

    jQuery('.checkbox-group').on('change', function() {
        jQuery('#main-form').validate().element('.checkbox-group');
    });

    jQuery('.js-select2').on('change', e => {
        jQuery(e.currentTarget).valid();
    });

    tippy('#myButton', {
        content: 'My tooltip!',
    });
    }

    static async handleFetchResponse(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    static updateDropdown(dropdownId, data, placeholder) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
        data.forEach(item => {
            dropdown.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.name.toUpperCase()}</option>`);
        });
        dropdown.disabled = data.length === 0;
    }   

    static resetCheckboxesButtons()
    {
        this.checkboxRow.hidden = true;
        this.checkboxDescLabel.innerHTML = '';
        this.checkboxContainer.innerHTML = '';

        this.checboxInfraRow.hidden = true;
        this.cheboxInfraLabel.innerHTML = '';
        this.checkboxInfraContainer.innerHTML = '';

        // Desmarcar todos los radios
        jQuery('#checkbox-container input[type="checkbox"]').prop('checked', false);
        jQuery('#checkbox-infra-container input[type="checkbox"]').prop('checked', false);

        // Marcar un valor específico (por ejemplo, "NO" para cada grupo)
        //jQuery('#checkbox-infra-container input[type="checkbox"][value="0"]').prop('checked', true);
    }

    static resetAll() 
    {
        this.updateDropdown('sede-dropdown', [], 'Seleccione sede..');
        this.updateDropdown('tipo-cargo-dropdown', [], 'Seleccione tipo de cargo..');
        this.updateDropdown('cargo-dropdown', [], 'Seleccione cargo..');
        this.resetPerfilDropdown();
    }

     static resetPerfilDropdown() 
    {
        this.resetCheckboxesButtons();
        this.rowEspecialidad.hidden = true;
        this.searchEspecialidad.value = '';
        this.radioAdicionSedeMultiple.hidden = true;
        this.rowSedeMultiple.hidden = true;
        this.observaciones.value = '';
    }

    static async showToast(title, message, type) 
    {
        let toast = Swal.mixin({
            buttonsStyling: false,
            target: '#page-container',
            customClass: {
                confirmButton: 'btn btn-primary m-1',
                cancelButton: 'btn btn-danger m-1',
                input: 'form-control'
            }
        });
    
        toast.fire(title, message, type);
    }

    static async AutocompleteDataLoguin() 
    {
        const route = "/fetchDataIdentificacionLoguin";
        const routeAutocompletarDatoUsuario = "/fetchDataAutoCompleteLoguin";
    
        jQuery('#identity_number').typeahead({
            source: function(query, process) {
                fetch(`${route}?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    // Convertir cada identificacion a string
                    const stringData = data.map(item => item.toString());
                    return process(stringData);
                })
                .catch(error => console.error('Error en la búsqueda o documento no encontrado:', error.message));
            },
            afterSelect: function(item) {
                fetch(`${routeAutocompletarDatoUsuario}?identificacion=${item}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    // Rellenar los campos del formulario con la información recibida
                    jQuery('#type_identity_number').val(data.tipo_doc_id);
                    jQuery('#identity_number').val(data.identificacion);
                    jQuery('#first_name').val(data.nombres);
                    jQuery('#last_name').val(data.apellidos);
                    jQuery('#email').val(data.email);
                    jQuery('#fecha_nacimiento').val(data.fecha_nacimiento);
                })
                .catch(error => console.error('Error al obtener los datos del usuario:', error));

            }
        });
    }

    static async zonalChangeHandler() 
    {
        const idZonal = this.zonalDropdown.value;
        //console.log(idZonal);
        if (!idZonal) {
            this.resetAll();
            return;
        }

        try {
            const response = await fetch("/fetchSedes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ zonal_id: idZonal })
            });

            const data = await this.handleFetchResponse(response);
            //console.log(data);
            this.updateDropdown('sede-dropdown', data.sedes, 'Seleccione sede..');
            this.updateDropdown('tipo-cargo-dropdown', [], 'Seleccione tipo de cargo..');
            this.updateDropdown('cargo-dropdown', [], 'Seleccione cargo..');
            this.resetPerfilDropdown();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static async sedeChangeHandler() 
    {
        const idSede = this.sedeDropdown.value;
        if (!idSede) {
            this.resetAll();
            return;
        }

        try {
            const response = await fetch("/fetchTipoCargoSede", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ sede_id: idSede })
            });

            const data = await this.handleFetchResponse(response);
            this.updateDropdown('tipo-cargo-dropdown', data.tipo_cargo_sede, 'Seleccione tipo de cargo..');
            this.updateDropdown('cargo-dropdown', [], 'Seleccione cargo..');
            this.resetPerfilDropdown();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static async cargoSedeChangeHandler() 
    {
        const idTipoCargo = this.tipoCargoDropdown.value;
        const idSede = this.sedeDropdown.value;

        if (!idTipoCargo) {
            this.resetAll();
            return;
        }

        try {
            const response = await fetch("/fetchCargoSede", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ tipo_cargo_id: idTipoCargo, sede_id: idSede })
            });

            const data = await this.handleFetchResponse(response);
            this.updateDropdown('cargo-dropdown', data.cargo_sede, 'Seleccione cargo..');
            this.resetPerfilDropdown();
            //this.rowEspecialidad.hidden = true;
            //this.searchEspecialidad.value = '';

        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static async CargoAppPerfilChangeHandler() 
    {
        const idSede = this.sedeDropdown.value;
        const idCargo = this.cargoSedeDropdown.value;
        this.radioAdicionSedeMultiple.hidden = true;
        this.rowSedeMultiple.hidden = true;
    
        if (!idCargo) {
            this.resetAll();
            return;
        }
    
        try {
            // Mostrar el bloque
            this.blockSolicitud.hidden = false;
            // Mostrar el bloque de solicitudes y activar el estado de "cargando"
            this.blockElement.classList.add('block-mode-loading');
    
            const response = await fetch("/fetchCargoAppPerfil", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ cargo_id: idCargo, sede_id: idSede })
            });
    
            if (!response.ok) {
                const errorData = await response.json();  // Extraer el mensaje desde el backend
                throw new Error(errorData.message || 'Something went wrong..');
            }
    
            const data = await this.handleFetchResponse(response);
            //console.log(data);
            const renderPerfilesCheckboxes = data.perfiles;
            const renderInfraCheckboxes = data.solicitud_infra;
            const espEverestPerfilId = data.perfil_esp_everest_id;
            const espPanaPerfilId = data.perfil_esp_pana_id;

            // Valida si el cargo seleccionado es especialista EVEREST
            if (espEverestPerfilId != false) this.sedesAdicionalesChangeHandler(espEverestPerfilId);
    
            // oculta y setea el contenedor del input especialidaddes antes de agregar nuevos elementos
            //this.rowEspecialidad.hidden = this.perfilesEspecialistaId.includes(idCargo) ? false : true;
            this.rowEspecialidad.hidden = (espPanaPerfilId !== false || espEverestPerfilId !== false) ? false : true;
            this.searchEspecialidad.value = '';
            
            // Limpiar los contenedores de checkboxes después de la animación
            this.checkboxContainer.innerHTML = '';
            this.checkboxInfraContainer.innerHTML = '';
            // Mostrar los nuevos checkboxes
            this.checkboxRow.hidden = false;
            this.checboxInfraRow.hidden = false;
                
            // Remover las clases de animación para próximas ejecuciones
            this.blockElement.classList.remove('block-mode-loading');
            
            // Crear los checkboxes dinámicamente
            renderPerfilesCheckboxes.forEach((perfil, index) => {
                this.checkboxDescLabel.textContent = 'Aplicaciones y perfiles disponibles para el cargo seleccionado:';
                
                const checkboxDiv = document.createElement('div');
                checkboxDiv.classList.add('form-check', 'form-check-inline');

                const checkboxInput = document.createElement('input');
                checkboxInput.classList.add('form-check-input', 'checkbox-group');
                checkboxInput.type = 'checkbox';
                checkboxInput.value = perfil.perfil;
                checkboxInput.id = `perfil-${index}`;
                checkboxInput.setAttribute('data-perfil-id', perfil.perfil_id);
                checkboxInput.setAttribute('data-app-id', perfil.aplicacion_id);
                checkboxInput.name = `checkbox-group`;

                const checkboxLabel = document.createElement('label');
                checkboxLabel.classList.add('form-check-label');
                checkboxLabel.htmlFor = `perfil-${index}`;
                const app = perfil.aplicacion
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                const appPerfil = perfil.perfil
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                checkboxLabel.textContent = `${app} ${appPerfil}`;

                checkboxDiv.appendChild(checkboxInput);
                checkboxDiv.appendChild(checkboxLabel);

                this.checkboxContainer.appendChild(checkboxDiv);
            });

            const explicaciones = {
                correo: {
                    titulo: '¿Qué es un Correo Institucional?',
                    descripcion: 'Es una cuenta de correo asignada por la institución, utilizada para comunicaciones oficiales y acceso a recursos internos.',
                },
                dominio: {
                    titulo: '¿Qué es un Usuario de Dominio?',
                    descripcion: 'Es una cuenta que permite a los usuarios autenticarse y acceder a recursos compartidos en la red de la institución.',
                },
                vpn: {
                    titulo: '¿Qué es una VPN?',
                    descripcion: 'Una VPN (Red Privada Virtual) permite a los usuarios conectarse de forma segura a los recursos internos de la institución desde ubicaciones remotas.',
                },
            };

            renderInfraCheckboxes.forEach((solicitud, index) => {
                this.cheboxInfraLabel.textContent = 'Solicitudes de Infraestructura disponibles para el cargo seleccionado:';

                const checkboxCorreo = document.createElement('div');
                checkboxCorreo.className = 'form-check';
                checkboxCorreo.innerHTML = `
                    <input type="checkbox" class="form-check-input checkbox-group" name="sw_correo_${index}" value="1"
                        id="sw_correo_${solicitud.sw_correo}" ${solicitud.sw_correo === 0 ? 'disabled' : ''}>
                    <label for="sw_correo_${solicitud.sw_correo}" class="form-check-label">Requiere Correo Institucional</label>
                    <i class="fa fa-circle-question text-primary btn-tooltip" data-tippy-tipo="correo"></i>`;
                                    
                const checkboxDominio = document.createElement('div');
                checkboxDominio.className = 'form-check';
                checkboxDominio.innerHTML = `
                    <input type="checkbox" class="form-check-input checkbox-group" name="sw_dominio_${index}" value="1"
                        id="sw_dominio_${solicitud.sw_dominio}" ${solicitud.sw_dominio === 0 ? 'disabled' : ''}>
                    <label for="sw_dominio_${solicitud.sw_dominio}" class="form-check-label">Requiere Usuario Dominio</label>
                    <i class="fa fa-circle-question text-primary btn-tooltip" data-tippy-tipo="dominio"></i>`;
                
                const checkboxVPN = document.createElement('div');
                checkboxVPN.className = 'form-check';
                checkboxVPN.innerHTML = `
                    <input type="checkbox" class="form-check-input checkbox-group" name="sw_vpn_${index}" value="1"
                        id="sw_vpn_${solicitud.sw_vpn}" ${solicitud.sw_vpn === 0 ? 'disabled' : ''}>
                    <label for="sw_vpn_${solicitud.sw_vpn}" class="form-check-label">Requiere VPN</label>
                    <i class="fa fa-circle-question text-primary btn-tooltip" data-tippy-tipo="vpn"></i>`;

                this.checkboxInfraContainer.appendChild(checkboxCorreo);
                this.checkboxInfraContainer.appendChild(checkboxDominio);
                this.checkboxInfraContainer.appendChild(checkboxVPN);
            });

            tippy('.btn-tooltip', {
                content(reference) {
                    const tipo = reference.getAttribute('data-tippy-tipo');
                    if (explicaciones[tipo]) {
                        const { titulo, descripcion } = explicaciones[tipo];
                        return `<strong>${titulo}</strong><br>${descripcion}`;
                    }
                    return 'Información no disponible';
                },
                allowHTML: true,
                theme: 'material',
                animation: 'fade',
                placement: 'right',
                arrow: true,
            });

        } catch (error) {
            // Remover la clase `block-mode-loading` si ocurre un error
            this.blockElement.classList.remove('block-mode-loading');
            //console.log('Error', error);
            this.showToast('Oops...', `${error.message}`, 'warning');
            this.cargoSedeDropdown.value = '';
            this.blockSolicitud.hidden = true;
            this.radioAdicionSedeMultiple.hidden = true;
            this.rowSedeMultiple.hidden = true;
            this.resetPerfilDropdown();
        }
    }

    static async sedesAdicionalesChangeHandler(perfilId) {
    
        if (perfilId) {
            this.radioAdicionSedeMultiple.hidden = false;
            const radioAdicionSedeMultipleHTML = `
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="sedeMultipleDecision" 
                        id="sedeMultipleSi" value="si">
                    <label class="form-check-label" for="sedeMultipleSi">Si</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="sedeMultipleDecision" 
                        id="sedeMultipleNo" value="no" checked>
                    <label class="form-check-label" for="sedeMultipleNo">No</label>
                </div>`;
            this.radioAdicionSedeMultipleContainer.innerHTML = radioAdicionSedeMultipleHTML;
    
                // Add radio button event listeners
                const radioButtons = document.querySelectorAll('input[name="sedeMultipleDecision"]');
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        const showMultiSelect = e.target.value === 'si';
                        this.rowSedeMultiple.hidden = !showMultiSelect;
                        
                        if (showMultiSelect) {
                            // Initialize MultiSelect only when "Si" is selected
                                this.fetchSedesAdicionales();
                        }
                    });
                });

                // Initially hide MultiSelect since "No" is checked by default
                this.rowSedeMultiple.hidden = true;
        } else {
            this.radioAdicionSedeMultiple.hidden = true;
            this.rowSedeMultiple.hidden = true;
        }
    }

    static async fetchSedesAdicionales() {
        const idZonal = this.zonalDropdown.value;
        const idSede = this.sedeDropdown.value;
        const idCargo = this.cargoSedeDropdown.value;

        try {
            const response = await fetch("/fetchSedesAdicionales", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ cargo_id: idCargo, zonal_id: idZonal, sede_id: idSede })
            });

            if (!response.ok) {
                const errorData = await response.json();  // Extraer el mensaje desde el backend
                throw new Error(errorData.message || 'Something went wrong..')
            }

            const data = await response.json();
            this.MultiSelectSedes(data.sedes_multiples);

        } catch (error) {
            console.error('Fetch error:', error);
            this.showToast('Error...', `${error.message}`, 'error');
        }
    }

    static async MultiSelectSedes(sedesAdicionales) {
        const selectElement = document.querySelector('#sedes-multiple');
        selectElement.multiSelect = new MultiSelect(selectElement, {
            data: sedesAdicionales.map(sede => ({
                value: sede.id,
                text: sede.name,
                selected: false
            })),
            onSelect: function (value, text) {
                //console.log('Selected:', value, text);
            }
        });
    }

    static clearForm() {
        document.getElementById('type_identity_number').value = '',
        document.getElementById('identity_number').value = '';
        document.getElementById('first_name').value = '';
        document.getElementById('last_name').value = '';
        document.getElementById('email').value = '';
        this.fechaNacimiento.value = '';
        this.zonalDropdown.value = '';
        this.sedeDropdown.value = '';
        this.tipoCargoDropdown.value = '';
        this.cargoSedeDropdown.value = '';
        this.searchEspecialidad.value = '';
        this.resetAll();
    }

    static async handleSubmit(event) {
        event.preventDefault();

        if (!jQuery('#main-form').valid()) {
            // Si la validación falla, detén el proceso y no envíes el formulario
            console.log('El formulario contiene campos que deben ser validados, no se enviará.');
            return;
        }

        // Obtener los valores seleccionados de los checkboxes de Aplicaciones y Perfiles
        const appData = [];
        const appDivs = this.checkboxContainer.querySelectorAll('.form-check');

        appDivs.forEach(div => {
            const appInput = div.querySelector('input[data-app-id]:checked');
            const perfilInput = div.querySelector('input[data-perfil-id]:checked');

            if (appInput && perfilInput) {
                const appId = appInput.getAttribute('data-app-id');
                const perfilId = perfilInput.getAttribute('data-perfil-id');
                appData.push({app_id: appId, perfil_id: perfilId});
            }
        });

        //console.log(appData);

        // Obtener los valores seleccionados de los checkboxes de Infraestructura
        const radioData = [];
        const radioContainers = this.checkboxInfraContainer.querySelectorAll('.form-check'); // Seleccionamos todos los contenedores de checkbox
        
        radioContainers.forEach(container => {
            const checkedRadio = container.querySelector('input[type="checkbox"]:checked'); // Buscamos el checkbox seleccionado dentro del contenedor
                 
            if (checkedRadio) {
                    const radioSolicitud = container.querySelector('.form-check-label').textContent.trim();
                    const radioValue = checkedRadio.value;
                    radioData.push({radio_solicitud: radioSolicitud,radio_valor: radioValue});
            }
        });

        //console.log(radioData);

        // Obtener los valores seleccionados del MultiSelect
        const selectedData = [];
        const selectElements = document.querySelectorAll('.multi-select-option.multi-select-selected');

        let sedesIdsString = '';
        
        if (selectElements.length > 0) {
            const sedesIds = [];
            selectElements.forEach(element => {
                const getText = element.querySelector('.multi-select-option-text').textContent;

                const selectedValue = element.getAttribute('data-value');
                const selectedText = getText;

                if (selectedValue !== null && selectedValue !== '0') {
                    sedesIds.push({id: selectedValue, name: selectedText});
                }
            });

            sedesIdsString = JSON.stringify(sedesIds);
        }

        //console.log(selectedData);

        const formData = {
            tipo_identificacion: document.getElementById('type_identity_number').value,
            identificacion: document.getElementById('identity_number').value,
            nombre: document.getElementById('first_name').value,
            apellido: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            fecha_nacimiento: this.fechaNacimiento.value,
            zonal_id: this.zonalDropdown.value,
            sede_id: this.sedeDropdown.value,
            cargo_id: this.cargoSedeDropdown.value,
            aplicaciones: appData,
            infraestructura: radioData,
            especialidad: this.searchEspecialidad.value,
            observaciones: this.observaciones.value,
            sedes_adicionales: sedesIdsString,
        };

        //console.log('Request del Formulario');
        //console.group();
        //console.log('loguin usuario', formData);
        //this.showToast('Oops...', `Formulario loguin enviado correctamente`, 'success');

        this.toast.fire({
        title: 'Esta seguro?',
        text: 'Se enviaran los datos del formulario para la creacion del loguin!',
        icon: 'warning',
        showCancelButton: true,
        customClass: {
            confirmButton: 'btn btn-success m-1',
            cancelButton: 'btn btn-secondary m-1'
        },
        confirmButtonText: 'Si, enviar!',
        cancelButtonText: 'Cancelar',
        html: false,
        preConfirm: e => {
            return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 50);
            });
        }
        }).then(async result => {
            if (result.value) {                
                try {
                    const response = await fetch('/storeLoguinTicket', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        this.showToast('Error...', `Error al enviar Formulario Loguin ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();

                    const ticketLoguinNumber = result.ticketLoguin !== null ? result.ticketLoguin : null;
                    const ticketInfraNumber = result.ticketInfraestructura !== null ? result.ticketInfraestructura : null;

                    if (ticketLoguinNumber) {
                        const URLTicketLoguin = `<a class="fw-semibold" href="http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${ticketLoguinNumber}" target="_blank">#${ticketLoguinNumber}</a>`;
                        console.log('ID de ticketLoguin:', ticketLoguinNumber);
                        this.showToast('Formulario Loguin Enviado!', `TICKET Loguin ${URLTicketLoguin}`, 'success');
                    }
                    
                    if (ticketInfraNumber) {
                        const URLticketInfraNumber = `<a class="fw-semibold" href="http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${ticketInfraNumber}" target="_blank">#${ticketInfraNumber}</a>`;
                        console.log('ID de ticketInfraestructura:', ticketInfraNumber);
                        this.showToast('Formulario Loguin Enviado!', `TICKET Infraestructura ${URLticketInfraNumber}`, 'success');
                    }

                    if (ticketLoguinNumber && ticketInfraNumber) {
                        const URLTicketLoguin = `<a class="fw-semibold" href="http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${ticketLoguinNumber}" target="_blank">#${ticketLoguinNumber}</a>`;
                        const URLticketInfraNumber = `<a class="fw-semibold" href="http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${ticketInfraNumber}" target="_blank">#${ticketInfraNumber}</a>`;
                        console.log('ID de ticketInfraestructura:', ticketInfraNumber);
                        console.log('ID de ticketLoguin:', ticketLoguinNumber);
                        this.showToast('Formulario Loguin Enviado!', `TICKET Loguin ${URLTicketLoguin} <br> TICKET Infraestructura ${URLticketInfraNumber}`, 'success');
                    }

                    this.clearForm();
                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar formulario loguin ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });
    }

    static init() {
        this.initFormElements();
        this.AutocompleteDataLoguin();
        this.zonalDropdown.addEventListener('change', () => this.zonalChangeHandler());
        this.sedeDropdown.addEventListener('change', () => this.sedeChangeHandler());
        this.tipoCargoDropdown.addEventListener('change', () => this.cargoSedeChangeHandler());
        this.cargoSedeDropdown.addEventListener('change', () => this.CargoAppPerfilChangeHandler());
        this.btnReset.addEventListener('click', () => this.clearForm());
        this.mainForm.addEventListener('submit', (event) => this.handleSubmit(event));
    }
}

// Initialize when page loads
Codebase.onLoad(() => ApplicationFormManager.init());