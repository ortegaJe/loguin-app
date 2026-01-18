import MultiSelect from './MultiSelect.js'; // Adjust the path as needed
    let appPerfilesSeleccionadosIds = [];
    let sedesSeleccionadasIds = [];

class PerfilFormManager {

    static initFormElements() {
        this.mainForm = document.getElementById('main-form');
        this.cargo = document.getElementById('cargo');
        this.perfil = document.getElementById('perfil');
        this.aplicaciones = document.getElementById('aplicacion');
        this.sedes = document.getElementById('sedes');
        this.btnSubmit = document.getElementById('btnSubmit');
        //this.btnSubmit.disabled = true
        this.toast = Swal.mixin({
            buttonsStyling: false,
            target: '#page-container',
            customClass: {
              confirmButton: 'btn btn-primary m-1',
              cancelButton: 'btn btn-danger m-1',
              input: 'form-control'
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

    static async getAppPerfiles() {

        try {
            const response = await fetch("/getAppPerfiles", {
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
            //this.blockSedes.hidden = false;
            this.MultiSelectAplicaciones(data.app_perfiles);

        } catch (error) {
            console.error('Fetch error:', error);
            this.showToast('Error...', `${error.message}`, 'error');
        }
    }

    static async MultiSelectAplicaciones(appPerfiles) {
        const selectElement = this.aplicaciones;
        selectElement.multiSelect = new MultiSelect(selectElement, {
            data: appPerfiles.map(aplicacion => ({
                value: aplicacion.perfil_id,
                text: aplicacion.perfil,
            })),
            placeholder: 'Seleccione aplicación..',
            onSelect: function (value, text) {
                //console.log('Selected:', value, text);
                appPerfilesSeleccionadosIds = selectElement.multiSelect.selectedValues;
            }
        });
    
    }

    static async getSedes() {

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
            //this.blockSedes.hidden = false;
            this.MultiSelectSedes(data.sedes);

        } catch (error) {
            console.error('Fetch error:', error);
            this.showToast('Error...', `${error.message}`, 'error');
        }
    }

    static async MultiSelectSedes(sedes) {
        const selectElement = this.sedes;
        selectElement.multiSelect = new MultiSelect(selectElement, {
            data: sedes.map(sede => ({
                value: sede.id,
                text: sede.name,
            })),
            placeholder: 'Seleccione sede(s)..',
            onSelect: function (value, text) {
                //console.log('Selected:', value, text);
                sedesSeleccionadasIds = selectElement.multiSelect.selectedValues;
            }
        });

    }

    static clearForm() {
        this.cargo.value = '',
        this.perfil.value = '',
        this.aplicaciones.value = '',
        this.sedes.value = ''
    }

    static async handleSubmit(event) {
        event.preventDefault();

/*         if (!jQuery('#main-form').valid()) {
            // Si la validación falla, detén el proceso y no envíes el formulario
            console.log('El formulario contiene campos que deben ser validados, no se enviará.');
            return;
        } */

        const formData = {
            cargo: this.cargo.value,
            perfil: this.perfil.value,
            aplicaciones: appPerfilesSeleccionadosIds,
            sedes: sedesSeleccionadasIds,
        };

        //console.log('Request del Formulario');
        //console.group();
        console.log('result:', formData);
        //this.showToast('Oops...', `Formulario loguin enviado correctamente`, 'success');

    this.toast.fire({
        title: 'Esta seguro?',
        text: 'Se enviaran los datos para la creación del perfil!',
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
                    const response = await fetch('/storePerfil', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        this.showToast('Error...', `Error al guardar datos del perfil ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();
                    console.log(result);
                    this.clearForm();
                    this.showToast('Perfil Creado!', ` `, 'success');

                } catch (error) {
                    console.error('Error al guardar los datos del perfil:', error);
                    this.showToast('Error...', `Error al guardar perfil ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });
    }

    static init() {
        this.initFormElements();
        this.getAppPerfiles();
        this.getSedes();
        //this.sedeDropdown.addEventListener('change', () => this.sedeChangeHandler());
        this.mainForm.addEventListener('submit', (event) => this.handleSubmit(event));
    }
}

// Initialize when page loads
Codebase.onLoad(() => PerfilFormManager.init());