class ApplicationFormManager {
    static panaAppNames = ["PANA PROFESIONALES", "PANA ADMINISTRATIVO"];
    static selectedPerfiles = [];

    static initFormElements() {
        this.mainForm = document.getElementById('main-form');
        this.zonalDropdown = document.getElementById('zonal-dropdown');
        this.sedeDropdown = document.getElementById('sede-dropdown');
        this.appDropdown = document.getElementById('app-dropdown');
        this.perfilDropdown = document.getElementById('perfil-dropdown');
        this.applicationsList = document.getElementById('applications-list');
        this.btnAdd = document.getElementById('btn-add');
        this.btnReset = document.getElementById('btn-reset');
        this.btnRefresh = document.getElementById('btn-refresh');
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
            dropdown.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.nombre}</option>`);
        });
        dropdown.disabled = data.length === 0;
    }

    static resetAll() {
        this.updateDropdown('sede-dropdown', [], 'Seleccione Sede..');
        this.updateDropdown('app-dropdown', [], 'Seleccione Aplicación..');
        this.resetPerfilDropdown();
        this.applicationsList.innerHTML = '';
        this.btnAdd.disabled = true;
        this.selectedPerfiles = [];
    }

    static resetPerfilDropdown() {
        this.perfilDropdown.innerHTML = '<option value="">Seleccione Perfil..</option>';
        this.perfilDropdown.disabled = true;
        this.btnAdd.disabled = true;
    }

    static disableSelectedPerfiles() {
        const options = this.perfilDropdown.querySelectorAll('option');
        options.forEach(option => {
            if (this.selectedPerfiles.includes(option.value)) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    }

    static async zonalChangeHandler() {
        const idZonal = this.zonalDropdown.value;
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
            this.updateDropdown('sede-dropdown', data.sedes, 'Seleccione Sede..');
            this.resetPerfilDropdown();
            this.applicationsList.innerHTML = '';
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static async sedeChangeHandler() {
        const idSede = this.sedeDropdown.value;
        if (!idSede) {
            this.resetAll();
            return;
        }

        try {
            const response = await fetch("/fetchApps", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ sede_id: idSede })
            });

            const data = await this.handleFetchResponse(response);
            this.updateDropdown('app-dropdown', data.app_sede, 'Seleccione Aplicación..');
            this.resetPerfilDropdown();
            this.applicationsList.innerHTML = '';
            this.selectedPerfiles = [];
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static async appChangeHandler() {
        const idApp = this.appDropdown.value;
        const selectedAppText = this.appDropdown.options[this.appDropdown.selectedIndex].text;

        if (!idApp) {
            this.resetPerfilDropdown();
            return;
        }

        try {
            const response = await fetch("fetchAppsPerfiles", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify({ app_id: idApp })
            });

            const data = await this.handleFetchResponse(response);
            this.updateDropdown('perfil-dropdown', data.perfiles, 'Seleccione Perfil..');

            if (this.panaAppNames.includes(selectedAppText)) {
                this.perfilDropdown.size = "10";
                this.perfilDropdown.multiple = true;
            } else {
                this.perfilDropdown.multiple = false;
                this.btnAdd.disabled = data.perfiles.length > 0 ? false : true;
            }
            this.btnAdd.disabled = false;
            this.disableSelectedPerfiles();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    static addApplicationHandler() {
        const selectedAppId = this.appDropdown.value;
        const selectedAppText = this.appDropdown.options[this.appDropdown.selectedIndex].text;
        const selectedPerfilOptions = [...this.perfilDropdown.selectedOptions];
    
        if (!selectedAppId || selectedPerfilOptions.length === 0) return;
    
        selectedPerfilOptions.forEach(option => {
            const selectedPerfilId = option.value;
            const selectedPerfilText = option.text;
    
            const appHtml = `<div class="form-group mb-2">
                <div class="row">
                    <div class="col-5">
                        <input type="text" class="form-control" value="${selectedAppText}" data-app-id="${selectedAppId}" readonly>
                    </div>
                    <div class="col-5">
                        <input type="text" class="form-control" value="${selectedPerfilText}" data-perfil-id="${selectedPerfilId}" readonly>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-alt-danger btn-remove"><i class="fa fa-trash-can"></i></button>
                    </div>
                </div>
            </div>`;
    
            this.applicationsList.insertAdjacentHTML('beforeend', appHtml);
    
            // Añadir el perfil seleccionado a la lista de perfiles seleccionados
            this.selectedPerfiles.push(selectedPerfilId);
    
            // Deshabilitar el perfil seleccionado
            this.perfilDropdown.querySelectorAll('option').forEach(option => {
                if (option.value === selectedPerfilId) {
                    option.disabled = true; // Deshabilitar el perfil en el dropdown
                }
            });
    
            if (!this.panaAppNames.includes(selectedAppText)) {
                this.appDropdown.querySelectorAll('option').forEach(appOption => {
                    if (appOption.text === selectedAppText) {
                        appOption.disabled = true; // Deshabilitar la aplicación si no es PANA
                    }
                });
            }
        });
    
        this.appDropdown.value = '';
        this.resetPerfilDropdown();
        this.btnAdd.disabled = true;
    }

    static removeApplicationHandler(event) {
        if (event.target.classList.contains('btn-remove')) {
            const row = event.target.closest('.form-group');
            const perfilId = row.querySelector('input[data-perfil-id]').getAttribute('data-perfil-id');
            const appId = row.querySelector('input[data-app-id]').getAttribute('data-app-id');
            const appText = this.appDropdown.querySelector(`option[value="${appId}"]`).text;
    
            // Remover el perfil de la lista de perfiles seleccionados
            this.selectedPerfiles = this.selectedPerfiles.filter(id => id !== perfilId);
    
            // Rehabilitar el perfil en el dropdown de perfiles
            this.perfilDropdown.querySelectorAll('option').forEach(option => {
                if (option.value === perfilId) {
                    option.disabled = false; // Rehabilitar el perfil en el dropdown
                }
            });
    
            // Si no es una aplicación PANA, también habilitamos la aplicación en el dropdown
            if (!this.panaAppNames.includes(appText)) {
                this.appDropdown.querySelectorAll('option').forEach(appOption => {
                    if (appOption.value === appId) {
                        appOption.disabled = false; // Rehabilitar la aplicación en el dropdown
                    }
                });
            }
    
            // Eliminar la fila correspondiente en la lista de aplicaciones
            row.remove();
        }
    }

    static clearForm() {
        document.getElementById('identity_number').value = '';
        document.getElementById('first_name').value = '';
        document.getElementById('job_title').value = '';
        document.getElementById('email').value = '';
        this.zonalDropdown.value = '';
        this.sedeDropdown.value = '';
        this.btnRefresh.click;
        this.resetAll();
    }

    static async handleSubmit(event) {
        event.preventDefault();

        const appData = [];
        const appDivs = this.applicationsList.querySelectorAll('.form-group');

        appDivs.forEach(div => {
            const appInput = div.querySelector('input[data-app-id]');
            const perfilInput = div.querySelector('input[data-perfil-id]');

            if (appInput && perfilInput) {
                const appId = appInput.getAttribute('data-app-id');
                const perfilId = perfilInput.getAttribute('data-perfil-id');
                appData.push({ app_id: appId, perfil_id: perfilId });
            }
        });

        const formData = {
            cc: document.getElementById('identity_number').value,
            nombre: document.getElementById('first_name').value,
            cargo: document.getElementById('job_title').value,
            email: document.getElementById('email').value,
            zonal_id: this.zonalDropdown.value,
            sede_id: this.sedeDropdown.value,
            aplicaciones: appData
        };

        try {
            const response = await fetch('/saveApplications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log('Formulario enviado correctamente');
                this.clearForm(); // Limpiar el formulario después de enviar los datos
            } else {
                console.error('Error al enviar el formulario:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    }

    static init() {
        this.initFormElements();
        this.zonalDropdown.addEventListener('change', () => this.zonalChangeHandler());
        this.sedeDropdown.addEventListener('change', () => this.sedeChangeHandler());
        this.appDropdown.addEventListener('change', () => this.appChangeHandler());
        this.applicationsList.addEventListener('click', (event) => this.removeApplicationHandler(event));
        this.btnAdd.addEventListener('click', () => this.addApplicationHandler());
        this.btnReset.addEventListener('click', () => this.clearForm());
        this.mainForm.addEventListener('submit', (event) => this.handleSubmit(event));
    }
}

// Initialize when page loads
Codebase.onLoad(() => ApplicationFormManager.init());