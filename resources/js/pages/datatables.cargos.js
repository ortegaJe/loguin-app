/*
 *  Document   : datatables.js
 *  Author     : pixelcave
 *  Description: Using custom JS code to init DataTables plugin
 */

// DataTables, for more examples you can check out https://www.datatables.net/
class pageTablesDatatables {
    static initElements() {
      this.cargoBtn = document.getElementById("cargoBtn");
      this.titleModalCargo = document.getElementById("cargoModalTitle");
      this.getModalCargo = document.getElementById("cargoModal");
      this.cargoId = document.getElementById("cargoId");
      this.submitForm = document.getElementById("cargoForm");

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
      jQuery('#cargoForm').validate({
        ignore: [],
        rules: {
            'nombre-cargo': {
              required: true,
            },
            'nombre-cargo-edit': {
              required: true,
            }
        },
        messages: {
            'nombre-cargo': {
                required: "Este campo es obligatorio",
            },
            'nombre-cargo-edit': {
                required: "Este campo es obligatorio",
            }
        }
      });
      
    }

    static async showToast(title, message, type) {
      let toast = Swal.mixin({
        buttonsStyling: false,
        target: "#page-container",
        customClass: {
          confirmButton: "btn btn-primary m-1",
          cancelButton: "btn btn-danger m-1",
          input: "form-control",
        },
      });
  
      toast.fire(title, message, type);
    }

    static recargarTabla() {
      const table = jQuery('.js-dataTable-full').DataTable();
      table.ajax.reload(null, false); // false evita que se reinicie la paginación
    }

    static openModalCargo() {
      // Abrir modal para agregar nuevo cargo con el id newCargoModal
      this.cargoBtn.addEventListener("click", () => {
        this.showModalNewCargo();
      });

      // Abrir modal para editar cargo y modal inactivar cargo
      const table = document.getElementById("solicitudesTable");
  
      table.addEventListener("click", (event) => {
        const btnEdit = event.target.closest(".btn-edit");
        const btnInactive = event.target.closest(".btn-inactive");
        const btnActive = event.target.closest(".btn-activate");
  
        if (btnEdit) {
          const cargoId = btnEdit.getAttribute("data-cargo-id");  
          this.fetchCargo(cargoId);
        }

          if (btnActive) {
          const cargoId = btnActive.getAttribute("data-cargo-id"); 
          const cargoNombre = btnActive.getAttribute("data-cargo-nombre");
          this.activateCargo(event, cargoId, cargoNombre);
        }

        if (btnInactive) {
          const cargoId = btnInactive.getAttribute("data-cargo-id"); 
          const cargoNombre = btnInactive.getAttribute("data-cargo-nombre");
          this.inactivateCargo(event, cargoId, cargoNombre);
        }
      });
    }

    static showModalNewCargo() {
      this.submitForm.dataset.mode = 'create';
      // Configurar el título del modal
      this.titleModalCargo.textContent = "Crear Nuevo Cargo";

      // Eliminar contenido anterior si existe
      const prevContent = this.getModalCargo.querySelector("#newCargoContent");
      if (prevContent) prevContent.remove();

      const prevContentEditCargo = this.getModalCargo.querySelector("#OpcionesInfraContent");
      if (prevContentEditCargo) prevContentEditCargo.remove();

      // Crear nuevo contenido
      const newCargoContent = document.createElement("div");
      newCargoContent.id = "newCargoContent";

      const nombreCargoInput = document.createElement("div");
      nombreCargoInput.className = "mb-4";

      const nombreLabel = document.createElement("label");
      nombreLabel.className = "form-label";
      nombreLabel.htmlFor = "nombre-cargo";
      nombreLabel.textContent = "Nombre del Cargo";

      const nombreInput = document.createElement("input");
      nombreInput.type = "text";
      nombreInput.className = "form-control";
      nombreInput.id = "nombre-cargo";
      nombreInput.name = "nombre-cargo";
      nombreInput.placeholder = "Ingrese el nombre del cargo..";

      nombreCargoInput.appendChild(nombreLabel);
      nombreCargoInput.appendChild(nombreInput);

      const tipoCargo = document.createElement("div");
      tipoCargo.className = "mb-4";
      const tipoCargoLabel = document.createElement("label");
      tipoCargoLabel.className = "form-label";
      tipoCargoLabel.textContent = "Tipo de Cargo";
      tipoCargo.appendChild(tipoCargoLabel);

      const spacex2 = document.createElement("div");
      spacex2.className = "space-x-2";
      spacex2.id = "tipo-cargo-radio-opciones";
      tipoCargo.appendChild(spacex2);

      const opcionesTipoCargoRadio = [
        { id: "administrativo", value: "1", text: "Administrativo", checked: true },
        { id: "asistencial", value: "2", text: "Asistencial", checked: false }
      ];

      opcionesTipoCargoRadio.forEach((opcion) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-check-inline";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = "tipo_cargo";
        input.id = opcion.id;
        input.value = opcion.value;
        if (opcion.checked) input.checked = true;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = opcion.id;
        label.textContent = opcion.text;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        spacex2.appendChild(formCheck);
      });

      const solicitudesInfra = document.createElement("div");
      solicitudesInfra.className = "mb-4";
      const solicitudesInfraLabel = document.createElement("label");
      solicitudesInfraLabel.className = "form-label";
      solicitudesInfraLabel.textContent = "Solicitudes de Infraestructura";
      solicitudesInfra.appendChild(solicitudesInfraLabel);

      const solicitudesInfraSpacex2 = document.createElement("div");
      solicitudesInfraSpacex2.className = "space-x-2";
      solicitudesInfraSpacex2.id = "opciones-infra-checkboxes";
      solicitudesInfra.appendChild(solicitudesInfraSpacex2);

      const opcionesSolicitudesIfraRadio = [
        { id: "correo", text: "Correo Institucional", checked: true },
        { id: "dominio", text: "Usuario de Dominio", checked: false },
        { id: "vpn", text: "VPN", checked: false }
      ];

      opcionesSolicitudesIfraRadio.forEach((opcion) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-check-inline";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.name = opcion.id;
        input.id = opcion.id;
        if (opcion.checked) input.checked = true;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = opcion.id;
        label.textContent = opcion.text;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        solicitudesInfraSpacex2.appendChild(formCheck);
      });

      newCargoContent.appendChild(nombreCargoInput);
      newCargoContent.appendChild(tipoCargo);
      newCargoContent.appendChild(solicitudesInfra);

      this.getModalCargo.querySelector(".block-content").appendChild(newCargoContent);

      const modal = new bootstrap.Modal(this.getModalCargo);
      modal.show();
    }

    static async storeCargo(event) {
        event.preventDefault();

        if (!jQuery('#cargoForm').valid()) {
          // Si la validación falla, detén el proceso y no envíes el formulario
          //console.log('El formulario contiene campos que deben ser validados, no se enviará.');
          return;
        }

        const inputRadioData = [];
        const radioContainer = document.getElementById('tipo-cargo-radio-opciones');
        const inputRadios = radioContainer.querySelectorAll('input[type="radio"][name="tipo_cargo"]:checked');
        inputRadios.forEach(radioInput => {
            if (radioInput.checked) {
              const checkboxName = radioInput.getAttribute('id');
              const tipoCargoValue = parseInt(radioInput.value, 10);

              inputRadioData.push({ tipo_cargo_nombre: checkboxName, tipo_cargo_id: tipoCargoValue });
            }
        });

        const inputCheckboxesData = [];
        const checkboxContainer = document.getElementById('opciones-infra-checkboxes');
        const inputCheckboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
        inputCheckboxes.forEach(checkboxInput => {
            const checkboxName = checkboxInput.getAttribute('name');
            inputCheckboxesData.push({ name: checkboxName, checked: checkboxInput.checked });
        });

        const formData = {
          nombre_cargo: document.getElementById('nombre-cargo').value,
          tipo_cargo: inputRadioData,
          opciones_infra: inputCheckboxesData
        }

        //console.log(formData);

        this.toast.fire({
        title: 'Esta seguro?',
        text: 'Se enviaran los datos del formulario para la creación del cargo!',
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

                    //const result = await response.json();

                    // cerrar modal this.getModalCargo
                    const modalInstance = bootstrap.Modal.getInstance(this.getModalCargo);
                    modalInstance.hide();

                    // mostrar toast exito
                    this.showToast('Exito', 'Cargo creado exitosamente', 'success');

                    // recargar datatable
                    this.recargarTabla();

                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar datos del cargo ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });

    }
  
    static async fetchCargo(cargoId) {
      if (!cargoId) {
        this.showToast(
          "Error",
          "No se pudo cargar los datos del cargo",
          "error"
        );
        return;
      }
  
      try {
        const response = await fetch(`/getPermisosCargo?cargoId=${cargoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok)
          throw new Error("Error al obtener los datos del cargo");
  
        const data = await response.json();
        //console.log(data);
        if (!data.permisosCargo) {
          throw new Error("Datos incompletos recibidos del servidor");
        }

        this.showModalEditCargo(data.permisosCargo, data.perfilSedes);
      } catch (error) {
        this.showToast("Error", `${error}`, "error");
        console.error("Fetch error:", error);
      }
    }

    static async showModalEditCargo(permisosCargo, perfilSedes) {
      //console.log(permisosCargo);
      this.submitForm.dataset.mode = 'edit';

      this.titleModalCargo.textContent = "Editar Cargo";
      this.cargoId.value = permisosCargo.cargo_id;

      // Eliminar contenido anterior si existe
      const prevContentNewCargo = this.getModalCargo.querySelector("#newCargoContent");
      if (prevContentNewCargo) prevContentNewCargo.remove();

      const prevContentEditCargo = this.getModalCargo.querySelector("#OpcionesInfraContent");
      if (prevContentEditCargo) prevContentEditCargo.remove();

      // Crear nuevo contenido
      const opcionesInfraContent = document.createElement("div");
      opcionesInfraContent.id = "OpcionesInfraContent";

      const nombreCargoInput = document.createElement("div");
      nombreCargoInput.className = "mb-4";

      const nombreLabel = document.createElement("label");
      nombreLabel.className = "form-label";
      nombreLabel.htmlFor = "nombre-cargo-edit";
      nombreLabel.textContent = "Nombre del Cargo";

      const nombreInput = document.createElement("input");
      nombreInput.type = "text";
      nombreInput.className = "form-control";
      nombreInput.id = "nombre-cargo-edit";
      nombreInput.name = "nombre-cargo-edit";
      nombreInput.value = permisosCargo.name;

      const tipoCargo = document.createElement("div");
      tipoCargo.className = "mb-4";
      const tipoCargoLabel = document.createElement("label");
      tipoCargoLabel.className = "form-label";
      tipoCargoLabel.textContent = "Tipo de Cargo";
      tipoCargo.appendChild(tipoCargoLabel);

      const spacex2 = document.createElement("div");
      spacex2.className = "space-x-2";
      spacex2.id = "tipo-cargo-radio-opciones-edit";
      tipoCargo.appendChild(spacex2);

      const opcionesTipoCargoRadio = [
        { id: "administrativo", 
          value: "1", 
          text: "Administrativo", 
          checked: permisosCargo.tipocargo_id == 1 ? true : false 
        },
        { id: "asistencial", 
          value: "2", 
          text: "Asistencial", 
          checked: permisosCargo.tipocargo_id == 2 ? true : false 
        }
      ];

      opcionesTipoCargoRadio.forEach((opcion) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-check-inline";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = "tipo_cargo_edit";
        input.id = opcion.id;
        input.value = opcion.value;
        if (opcion.checked) input.checked = true;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = opcion.id;
        label.textContent = opcion.text;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        spacex2.appendChild(formCheck);
      });

      const solicitudesInfra = document.createElement("div");
      solicitudesInfra.className = "mb-4";
      const solicitudesInfraLabel = document.createElement("label");
      solicitudesInfraLabel.className = "form-label";
      solicitudesInfraLabel.textContent = "Solicitudes de Infraestructura";
      solicitudesInfra.appendChild(solicitudesInfraLabel);

      const solicitudesInfraSpacex2 = document.createElement("div");
      solicitudesInfraSpacex2.className = "space-x-2";
      solicitudesInfraSpacex2.id = "opciones-infra-checkboxes-edit";
      solicitudesInfra.appendChild(solicitudesInfraSpacex2);

      const opciones = [
        {
          id: "correo-edit",
          name: "correo-edit",
          icon: "fa-envelope",
          text: "Correo institucional",
          checked: permisosCargo.sw_correo,
        },
        {
          id: "dominio-edit",
          name: "dominio-edit",
          icon: "fa-user-circle",
          text: "Usuario de dominio",
          checked: permisosCargo.sw_dominio,
        },
        {
          id: "vpn-edit",
          name: "vpn-edit",
          icon: "fa-globe",
          text: "VPN",
          checked: permisosCargo.sw_vpn,
        },
      ];

      opciones.forEach((opcion) => {
        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-check-inline";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.name = opcion.id;
        input.id = opcion.id;
        if (opcion.checked) input.checked = true;
        // input.checked = opcion.checked === 1 ? true : false;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = opcion.id;
        label.textContent = opcion.text;

        formCheck.appendChild(input);
        formCheck.appendChild(label);
        solicitudesInfraSpacex2.appendChild(formCheck);
      });

      // agregar datatable en el modal para visualizar los perfiles y sedes asignadas al cargo
      const perfilSedesTable = document.createElement("table");
      perfilSedesTable.className = "table table-bordered table-hover table-striped table-vcenter";
      perfilSedesTable.id = "perfil-sedes-table";

      const perfilSedesThead = document.createElement("thead");
      perfilSedesThead.innerHTML = `
        <tr>
          <th>Sede</th>
          <th>Perfil</th>
          <th>Aplicación</th>
          <th>Acciones</th>
        </tr>
      `;
      perfilSedesTable.appendChild(perfilSedesThead);

      const perfilSedesTbody = document.createElement("tbody");
      perfilSedes.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.sede_nombre}</td>
          <td>${item.perfil_nombre.toUpperCase()}</td>
          <td>${item.aplicacion_nombre}</td>
          <td class="text-center"><input type="checkbox" class="form-check-input" id="checkbox-perfil" data-id="${item.id}" ${item.estado === 1 ? 'checked' : ''}></td>
        `;
        perfilSedesTbody.appendChild(row);
      });
      perfilSedesTable.appendChild(perfilSedesTbody);

      const tableContainer = document.createElement("div");
      tableContainer.className = "table-responsive";
      tableContainer.style.maxHeight = "300px";
      tableContainer.style.overflowY = "auto";
      tableContainer.style.display = "block";
      tableContainer.appendChild(perfilSedesTable);

      nombreCargoInput.appendChild(nombreLabel);
      nombreCargoInput.appendChild(nombreInput);
      opcionesInfraContent.appendChild(nombreCargoInput);
      opcionesInfraContent.appendChild(tipoCargo);
      opcionesInfraContent.appendChild(solicitudesInfra);
      opcionesInfraContent.appendChild(tableContainer);
      
      this.getModalCargo.querySelector(".block-content").appendChild(opcionesInfraContent);
  
      const modalInstance = new bootstrap.Modal(this.getModalCargo);
      modalInstance.show();
    }

    static async updateCargo(event) {
        event.preventDefault();

        if (!jQuery('#cargoForm').valid()) {
          // Si la validación falla, detén el proceso y no envíes el formulario
          //console.log('El formulario contiene campos que deben ser validados, no se enviará.');
          return;
        }

        const inputRadioData = [];
        const radioContainer = document.getElementById('tipo-cargo-radio-opciones-edit');
        const inputRadios = radioContainer.querySelectorAll('input[type="radio"][name="tipo_cargo_edit"]:checked');
        inputRadios.forEach(radioInput => {
            if (radioInput.checked) {
              const checkboxName = radioInput.getAttribute('id');
              const tipoCargoValue = parseInt(radioInput.value, 10);

              inputRadioData.push({ tipo_cargo_nombre: checkboxName, tipo_cargo_id: tipoCargoValue });
            }
        });

        const inputCheckboxesData = [];
        const checkboxContainer = document.getElementById('opciones-infra-checkboxes-edit');
        const inputCheckboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]:checked');
        inputCheckboxes.forEach(checkboxInput => {
            const checkboxName = checkboxInput.getAttribute('name');
            inputCheckboxesData.push({ name: checkboxName, checked: checkboxInput.checked });
        });

        const inputCheckboxPerfilData = [];
        const perfilTable = document.getElementById('perfil-sedes-table');

        if (perfilTable) {
          const checkedPerfilBoxes = perfilTable.querySelectorAll('input[type="checkbox"]');
          checkedPerfilBoxes.forEach(checkboxInput => {
            const cargoPerfilId = checkboxInput.getAttribute('data-id');
            inputCheckboxPerfilData.push({ cargo_perfil_id: cargoPerfilId, checked: checkboxInput.checked });
          });
        }

        const formData = {
          cargo_id: this.cargoId.value,
          nombre_cargo: document.getElementById('nombre-cargo-edit').value,
          tipo_cargo: inputRadioData,
          opciones_infra: inputCheckboxesData,
          perfiles_sedes: inputCheckboxPerfilData
        }

        //console.log(formData);

        this.toast.fire({
        title: 'Esta seguro?',
        text: 'Se enviaran los datos del formulario para la actualización del cargo!',
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
                    const response = await fetch(`${'/editCargo/' + this.cargoId.value}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        this.showToast('Error...', `Error al enviar formulario para actualizar el cargo ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();

                    // cerrar modal this.getModalCargo
                    const modalInstance = bootstrap.Modal.getInstance(this.getModalCargo);
                    modalInstance.hide();

                    // mostrar toast exito
                    this.showToast('Exito', 'Cargo actualizado exitosamente', 'success');

                    // recargar datatable
                    this.recargarTabla();

                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar formulario cargo ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });

    }

    static async activateCargo(event, cargoId, cargoNombre) {
      event.preventDefault();

      const formData = {
        cargo_id: cargoId,
      }

      //console.log(formData);

      this.toast.fire({
      title: '¿Esta seguro?',
      text: `¿Desea activar el cargo ${cargoNombre}?`,
      icon: 'warning',
      showCancelButton: true,
      customClass: {
          confirmButton: 'btn btn-success m-1',
          cancelButton: 'btn btn-secondary m-1'
      },
      confirmButtonText: 'Si, activar!',
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
                  const response = await fetch(`${'/activateCargo/' + cargoId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                      },
                      body: JSON.stringify(formData)
                  });

                  if (!response.ok) {
                      this.showToast('Error...', `Error al enviar datos para activar el cargo ${response.statusText}`, 'error');
                      throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                  }

                  // mostrar toast exito
                  this.showToast('Exito', 'Cargo activado exitosamente', 'success');

                  // recargar datatable
                  this.recargarTabla();

              } catch (error) {
                  console.error('Error al enviar los datos del cargo:', error);
                  this.showToast('Error...', `Error al enviar los datos del cargo ${error}`, 'error');
              }
          } else if (result.dismiss === 'cancel') {
              //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
          }
      });
    }

    static async inactivateCargo(event, cargoId, cargoNombre) {
      event.preventDefault();

      const formData = {
        cargo_id: cargoId,
      }

      //console.log(formData);

      this.toast.fire({
      title: '¿Esta seguro?',
      text: `¿Desea inactivar el cargo ${cargoNombre}?`,
      icon: 'warning',
      showCancelButton: true,
      customClass: {
          confirmButton: 'btn btn-danger m-1',
          cancelButton: 'btn btn-secondary m-1'
      },
      confirmButtonText: 'Si, inactivar!',
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
                  const response = await fetch(`${'/inactivateCargo/' + cargoId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                      },
                      body: JSON.stringify(formData)
                  });

                  if (!response.ok) {
                      this.showToast('Error...', `Error al enviar datos para inactivar el cargo ${response.statusText}`, 'error');
                      throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                  }

                  // mostrar toast exito
                  this.showToast('Exito', 'Cargo inactivado exitosamente', 'success');

                  // recargar datatable
                  this.recargarTabla();

              } catch (error) {
                  console.error('Error al enviar los datos del cargo:', error);
                  this.showToast('Error...', `Error al enviar los datos del cargo ${error}`, 'error');
              }
          } else if (result.dismiss === 'cancel') {
              //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
          }
      });
    }
  
    /*
     * Init DataTables functionality
     */
    static initDataTables() {
      jQuery.extend(true, DataTable.ext.classes, {
        search: { input: "form-control" },
        length: { select: "form-select" },
      });
  
      jQuery.extend(true, DataTable.defaults, {
        language: {
          lengthMenu: "_MENU_",
          search: "_INPUT_",
          searchPlaceholder: "Buscar documento..",
          info: "Page <strong>_PAGE_</strong> of <strong>_PAGES_</strong>",
          paginate: {
            first: '<i class="fa fa-angle-double-left"></i>',
            previous: '<i class="fa fa-angle-left"></i>',
            next: '<i class="fa fa-angle-right"></i>',
            last: '<i class="fa fa-angle-double-right"></i>',
          },
        },
      });
  
      jQuery.extend(true, DataTable.Buttons.defaults, {
        dom: { button: { className: "btn btn-sm btn-primary" } },
      });
  
      // Recuperar valor guardado del localStorage (o usar 10 como valor por defecto)
      const savedPageLength = localStorage.getItem("datatable_length");
  
      const table = jQuery(".js-dataTable-full").DataTable({
        ajax: {
          url: "/fetchCargoList",
          type: "GET",
          dataSrc: "cargos",
        },
        //serverSide: true,
        processing: true,
        //responsive: true,
        pagingType: "simple_numbers",
        pageLength: savedPageLength ? parseInt(savedPageLength) : 10,
        autoWidth: false,
        order: [[3, "desc"]],
        columns: [
          {
            data: null,
            orderable: false,
            searchable: false,
            defaultContent: "",
          },
          { data: "nombre" },
          { data: "nombre_tipo_cargo" },
          { data: "fecha_creacion" },
          { data: "estado" },
          {
            data: null,
            orderable: false,
            searchable: false,
            className: "text-center",
            render: function (data, type, row) {
              const isActive = row.estado === 1;
              return `
          <div class="btn-group">
            ${isActive ? `
              <button type="button" class="btn btn-sm btn-danger btn-inactive"
                data-toggle="click-ripple" data-bs-toggle="tooltip" title="Inactivar"
                data-cargo-id="${row.cargo_id}"
                data-cargo-nombre="${row.nombre}">
                <i class="fa fa-times"></i>
              </button>
            ` : `
              <button type="button" class="btn btn-sm btn-success btn-activate"
                data-toggle="click-ripple" data-bs-toggle="tooltip" title="Activar"
                data-cargo-id="${row.cargo_id}"
                data-cargo-nombre="${row.nombre}">
                <i class="fa fa-check"></i>
              </button>
            `}
            <button type="button" class="btn btn-sm btn-secondary btn-edit"
              data-toggle="click-ripple" data-bs-toggle="tooltip" title="Actualizar"
              data-cargo-id="${row.cargo_id}">
              <i class="fa fa-pencil"></i>
            </button>
          </div>
              `;
            },
          },
        ],
        drawCallback: function (settings) {
          const api = this.api();
          api
            .column(0, { search: "applied", order: "applied" })
            .nodes()
            .each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
        },
        columnDefs: [
          {
            targets: 2,
            render: function (data, type, row) {
              if (type === "display") {
                const div = document.createElement("div");
                div.innerHTML = data;
                const tipo = div.textContent || div.innerText || "";
                //console.log(tipo.trim());
  
                // Asignar clase según el tipo
                let badgeClass = "badge bg-info w-100"; // Clase por defecto
                let icon = ""; // Icono por defecto
  
                return `<span class="${badgeClass}"><i class="${icon} me-1"></i>${tipo.trim()}</span>`;
              }
              return data;
            },
          },
          {
            targets: 3,
            render: function (data, type, row) {
              const rawDate = new Date(data);
              if (type === "display") {
                const formatted = new Intl.DateTimeFormat("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  //hour: '2-digit',
                  //minute: '2-digit',
                  //second: '2-digit',
                  //hour12: false
                }).format(rawDate);
                return `<span class="text-muted d-none d-md-table-cell">${formatted}</span>`;
              }
              return rawDate.getTime(); // timestamp para ordenamiento y búsqueda
            },
          },
          {
            targets: 4,
            render: function (data, type, row) {
                if (type === "display") {
                    const div = document.createElement("div");
                    div.innerHTML = data;
                    const estado = div.textContent || div.innerText || "";
                    //console.log(estado.trim());
      
                    // Asignar clase según el estado
                    let badgeClass = "badge bg-info w-100"; // Clase por defecto
                    let icon = ""; // Icono por defecto
                    let text = ""; // Texto por defecto
                    if (estado.trim() == false) {
                      badgeClass = "badge bg-secondary w-100";
                      icon = "";
                      text = "Inactivo";
                    }
                    if (estado.trim() == true) {
                      badgeClass = "badge bg-success w-100";
                      icon = "";
                      text = "Activo";
                    }
      
                    return `<span class="${badgeClass}"><i class="${icon}"></i>${text}</span>`;
                  }
                  return data;
            },
          },
        ],
      });
  
      table.on("length.dt", function (e, settings, len) {
        localStorage.setItem("datatable_length", len);
      });

      // insertar el filtro de tipo de cargo
      const tipoCargoFilterHTML = `
        <div class="col-md-auto me-auto">
          <select id="filter-tipo" class="form-select form-select">
            <option value="" disabled selected>Filtrar por tipo</option>
            <option value="">Todos</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Asistencial">Asistencial</option>
          </select>
        </div>
      `;
  
      // Insertar filtro de estado
      const estadoFilterHTML = `
        <div class="col-md-auto me-auto">
          <select id="filter-estado" class="form-select form-select">
            <option value="" disabled selected>Filtrar por estado</option>
            <option value="">Todos</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
      `;
  
    // Insertar el filtro de estado después del page length
    const filtroRow = document.querySelector(
      "#solicitudesTable_wrapper .row.mt-2.justify-content-between"
    );
    if (filtroRow) {
      const tempEstado = document.createElement("div");
      tempEstado.innerHTML = estadoFilterHTML;
      const filtroEstadoDiv = tempEstado.firstElementChild;

      const tempTipoCargo = document.createElement("div");
      tempTipoCargo.innerHTML = tipoCargoFilterHTML;
      const filtroTipoCargoDiv = tempTipoCargo.firstElementChild;

      const children = filtroRow.children;
      if (children.length >= 1) {
        // Insertar como segundo hijo
        filtroRow.insertBefore(filtroTipoCargoDiv, children[1]);
        // Insertar como tercer hijo
        filtroRow.insertBefore(filtroEstadoDiv, children[2]);
      } else {
        // Si no hay hijos, insertar simplemente
        filtroRow.appendChild(filtroTipoCargoDiv);
        filtroRow.appendChild(filtroEstadoDiv);
      }
    }
  
      // Filtro de estado
      const estadoSelect = document.getElementById("filter-estado");
      if (estadoSelect) {
        estadoSelect.addEventListener("change", function () {
          const value = this.value;
          table.column(4).search(value).draw(); // columna "ESTADO"
        });
      }

    // Filtro de tipo de cargo
    const tipoCargoSelect = document.getElementById("filter-tipo");
    if (tipoCargoSelect) {
        tipoCargoSelect.addEventListener("change", function () {
        const value = this.value;
        table.column(2).search(value).draw(); // columna "TIPO"
        });
    }
  
      const refreshButtonHTML = `
        <div class="col-md-auto">
          <button type="button" id="refresh-datatable" class="btn btn-md btn-alt-success me-1 mb-1"
            data-bs-toggle="tooltip" data-bs-placement="top" title="Actualizar lista">
            <i class="fa fa-sync opacity-50"></i>
          </button>
        </div>
      `;
  
      // Insertar el botón después del filtro de estado
      const refreshTemp = document.createElement("div");
      refreshTemp.innerHTML = refreshButtonHTML;
      const refreshBtnDiv = refreshTemp.firstElementChild;
  
      const filtroRowRefresh = document.querySelector(
        "#solicitudesTable_wrapper .row.mt-2.justify-content-between"
      );
      if (filtroRowRefresh) {
        const children = filtroRowRefresh.children;
        if (children.length >= 2) {
          // Insertar como tercer hijo (después del filtro de estado)
          filtroRowRefresh.insertBefore(refreshBtnDiv, children[4]);
        } else {
          filtroRowRefresh.appendChild(refreshBtnDiv);
        }
      }
  
      document
        .getElementById("refresh-datatable")
        .addEventListener("click", async function () {
          // Recargar la tabla
          pageTablesDatatables.recargarTabla();
        });
  
      // Activar tooltips después del renderizado
      table.on("draw", function () {
        const tooltipTriggerList = [].slice.call(
          document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
      });
  
      jQuery(".js-dataTable-buttons").DataTable({
        pagingType: "simple_numbers",
        pageLength: 5,
        autoWidth: false,
      });
    }
  
    /*
     * Init functionality
     */
    static init() {
      this.initElements();
      this.openModalCargo();
      this.initDataTables();
      this.submitForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const mode = this.submitForm.dataset.mode;

        if (mode === 'create') {
          this.storeCargo(event);
          return;
        }

        if (mode === 'edit') {
          this.updateCargo(event);
          return;
        }

        console.log('Modo de formulario no definido');
      });
      // Eliminar el valor de localStorage solo si se va a otra página
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
          const navType = performance.getEntriesByType("navigation")[0].type;
  
          if (navType !== "reload") {
            localStorage.removeItem("datatable_length");
          }
        }
      });
    }
  }
  
  // Initialize when page loads
  Codebase.onLoad(() => pageTablesDatatables.init());