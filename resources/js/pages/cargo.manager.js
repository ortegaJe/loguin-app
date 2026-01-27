import MultiSelect from './MultiSelect.js'; // Adjust the path as needed
    let sedesSeleccionadasIds = [];

class CargoFormManager {

    static initFormElements() {
        this.mainForm = document.getElementById('main-form');
        this.cargo = document.getElementById('cargo');
        this.tipoCargos = document.querySelectorAll('input[name="tipoCargo"]');
        this.radioTipoCargo = document.getElementById('radio-tipo-cargo');
        this.blockOpcionesInfra = document.getElementById('block-opciones-infra');
        this.checkOpInfra = document.getElementById('check-op-infra');
        this.checkboxContainers = document.querySelectorAll('.form-check'); // Seleccionamos solo los checkboxes dentro de los contenedores
        this.blockSedes = document.getElementById('block-sedes');
        this.contentSedes = document.getElementById('content-multi-select');
        this.sedes = document.getElementById('sedes');
        this.blockOpcionesInfra.hidden = true;
        this.blockSedes.hidden = true;
        this.toast = Swal.mixin({
            buttonsStyling: false,
            target: '#page-container',
            customClass: {
              confirmButton: 'btn btn-primary m-1',
              cancelButton: 'btn btn-danger m-1',
              input: 'form-control'
            }
          });

        // Init Form Validation
        jQuery('#main-form').validate({
            ignore: [],
            rules: {
                'cargo': {
                    required: true,
                },
                'tipoCargo': {
                    required: true,
                },
                'sedes': {
                    required: true,
                },
            },
            messages: {
                'cargo': {
                    required: "Este campo es obligatorio",
                },
                'tipoCargo': {
                    required: "Este campo es obligatorio",
                },
                'sedes': {
                    required: "Este campo es obligatorio"
                }
            }
        });
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

    static getSelectedTipoCargo() {
        const radioButtons = this.tipoCargos;

        if (!radioButtons) {
            return;
        }

        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const tipoCargo = e.target.value;
                //console.log(tipoCargo);
                this.getSedes(tipoCargo);
            });
        });

    }

    static async getSedes(tipoCargo) {

        try {
            const response = await fetch("/getSedes", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();  // Extraer el mensaje desde el backend
                throw new Error(errorData.message || 'Something went wrong..')
            }

            const data = await response.json();
            this.blockOpcionesInfra.hidden = false;
            this.blockSedes.hidden = false;
            this.MultiSelectPerfiles(tipoCargo, data.sedes);

        } catch (error) {
            console.error('Fetch error:', error);
            this.showToast('Error...', `${error.message}`, 'error');
        }
    }

    static async MultiSelectPerfiles(tipoCargo, sedes) {
        const selectElement = this.sedes;
        selectElement.multiSelect = new MultiSelect(selectElement, {
            data: sedes.map(sede => ({
                value: sede.id,
                text: sede.name
            })),
            onSelect: function (value, text) {
                //console.log('Selected:', value, text);
                sedesSeleccionadasIds = selectElement.multiSelect.selectedValues;
            },
            placeholder: 'Seleccionar sede(s)',
        });
    
        this.tipoCargoSeleccionado = tipoCargo;
    }

    static clearForm() {
        this.cargo.value = '';
        this.tipoCargos.forEach(radio => radio.checked = false);
        this.checkOpInfra.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        this.blockOpcionesInfra.hidden = true;
        this.blockSedes.hidden = true;
        this.cargo.focus();
    }

    static async handleSubmit(event) {
        event.preventDefault();

        if (!jQuery('#main-form').valid()) {
            // Si la validación falla, detén el proceso y no envíes el formulario
            console.log('El formulario contiene campos que deben ser validados, no se enviará.');
            return;
        }

        // Obtener los valores seleccionados de los checkboxes de Infraestructura
        const radioData = [];                
        this.checkboxContainers.forEach(container => {
            const checkedRadio = container.querySelector('input[type="checkbox"]:checked'); // Buscamos el checkbox seleccionado dentro del contenedor
                    
            if (checkedRadio) {
                    const radioSolicitud = container.querySelector('.form-check-label').textContent.trim();
                    const radioValue = checkedRadio.value;
                    radioData.push({radio_solicitud: radioSolicitud, radio_valor: radioValue});
            }
        });

        const formData = {
            cargo: this.cargo.value,
            tipo_cargo: this.tipoCargoSeleccionado,
            opcionesInfra: radioData,
            sedes: sedesSeleccionadasIds,
        };

        //console.log('Request del Formulario');
        //console.group();
        //console.log('result:', formData);
        //this.showToast('Oops...', `Formulario loguin enviado correctamente`, 'success');

        this.toast.fire({
            title: 'Esta seguro?',
            text: 'Se enviaran los datos del formulario para la creacion del cargo!',
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
                        const response = await fetch('/storeCargo', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                            },
                            body: JSON.stringify(formData)
                        });

                        if (!response.ok) {
                            this.showToast('Error...', `Error al enviar datos del cargo ${response.statusText}`, 'error');
                            throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                        }

                        const result = await response.json();
                        console.log(result);
                        this.clearForm();
                        this.showToast('Cargo Creado!', ` `, 'success');

                    } catch (error) {
                        console.error('Error al crear cargo:', error);
                        this.showToast('Error...', `Error al enviar datos del cargo ${error}`, 'error');
                    }
                } else if (result.dismiss === 'cancel') {
                    //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
                }
            });
    }

    static init() {
        this.initFormElements();
        this.getSelectedTipoCargo();
        //this.sedeDropdown.addEventListener('change', () => this.sedeChangeHandler());
        this.mainForm.addEventListener('submit', (event) => this.handleSubmit(event));
    }
}

// Initialize when page loads
Codebase.onLoad(() => CargoFormManager.init());