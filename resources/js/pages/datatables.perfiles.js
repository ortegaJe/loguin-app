/*
 *  Document   : datatables.js
 *  Author     : pixelcave
 *  Description: Using custom JS code to init DataTables plugin
 */

// DataTables, for more examples you can check out https://www.datatables.net/
class pageTablesDatatables {
    static initElements() {
      this.newPerfilBtn = document.getElementById("newPerfilBtn");
      this.titleModalPerfil = document.getElementById("perfilModalTitle");
      this.getModalPerfil = document.getElementById("perfilModal");
      this.perfilId = document.getElementById("perfilId");
      this.submitForm = document.getElementById("perfilForm");
      this.toast = Swal.mixin({
      buttonsStyling: false,
      target: '#page-container',
      customClass: {
        confirmButton: 'btn btn-primary m-1',
        cancelButton: 'btn btn-danger m-1',
        input: 'form-control'
        }
      });

      // Limpia select2 y contenido del modal al cerrarlo
      jQuery('#perfilModal').on('hidden.bs.modal', function () {
        const select = jQuery('#aplicaciones-perfil');
        const perfilApp = jQuery('#aplicaciones-perfil-edit');

        if (select.length && select.hasClass('select2-hidden-accessible')) {
          select.select2('destroy');
        }

        if (perfilApp.length && perfilApp.hasClass('select2-hidden-accessible')) {
          perfilApp.select2('destroy');
        }

        // Limpia el contenido del modal
        jQuery('#newPerfilContent').remove();
        jQuery('#editPerfilAppContent').remove();
      });

      // Init Form Validation
      jQuery('#perfilForm').validate({
        ignore: [],
        rules: {
            'nombre-perfil': {
              required: true,
            },
            'nombre-perfil-edit': {
              required: true,
            },
            'aplicaciones-perfil': {
              required: true,
            },
        },
        messages: {
            'nombre-perfil': {
                required: "Este campo es obligatorio",
            },
            'nombre-perfil-edit': {
                required: "Este campo es obligatorio",
            },
            'aplicaciones-perfil': {
                required: "Debe seleccionar una aplicación",
            },
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

    // crea un servicio fetch con Get para traer aplicaciones
    static async fetchAplicaciones() {
      try {
        const response = await fetch('/getAplicaciones');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching aplicaciones:", error);
        return [];
      }
    }

    static openModalPerfil() {
      // Abrir modal para agregar nuevo cargo con el id newCargoModal
      this.newPerfilBtn.addEventListener("click", () => {
        this.showModalNewPerfil(this.fetchAplicaciones());
      });

      // Abrir modal para editar cargo y modal inactivar cargo
      const table = document.getElementById("perfilesTable");
  
      table.addEventListener("click", (event) => {
        const btnEdit = event.target.closest(".btn-edit");
        const btnInactive = event.target.closest(".btn-inactive");
        const btnActive = event.target.closest(".btn-activate");
  
        if (btnEdit) {
          const perfilId = btnEdit.getAttribute("data-perfil-id");  
          this.fetchPerfil(perfilId);
        }

        if (btnActive) {
          const perfilId = btnActive.getAttribute("data-perfil-id"); 
          const perfilNombre = btnActive.getAttribute("data-perfil-nombre");
          this.activatePerfil(event, perfilId, perfilNombre);
        }

        if (btnInactive) {
          const perfilId = btnInactive.getAttribute("data-perfil-id"); 
          const perfilNombre = btnInactive.getAttribute("data-perfil-nombre");
          this.inactivatePerfil(event, perfilId, perfilNombre);
        }
      });
    }

    static showModalNewPerfil(aplicaciones) {
      this.submitForm.dataset.mode = 'create';
      this.titleModalPerfil.textContent = 'Crear Nuevo Perfil';

      // Limpia contenido previo
      const prevContent = this.getModalPerfil.querySelector('#newPerfilContent');
      if (prevContent) prevContent.remove();

      const newPerfilContent = document.createElement('div');
      newPerfilContent.id = 'newPerfilContent';

      /* =========================
        INPUT NOMBRE PERFIL
      ========================== */
      const nombreWrapper = document.createElement('div');
      nombreWrapper.className = 'mb-4';

      const nombreLabel = document.createElement('label');
      nombreLabel.className = 'form-label';
      nombreLabel.textContent = 'Nombre del Perfil';

      const nombreInput = document.createElement('input');
      nombreInput.type = 'text';
      nombreInput.className = 'form-control';
      nombreInput.id = 'nombre-perfil';
      nombreInput.name = 'nombre-perfil';
      nombreInput.placeholder = 'Ingrese el nombre del perfil';

      nombreWrapper.appendChild(nombreLabel);
      nombreWrapper.appendChild(nombreInput);

      /* =========================
        SELECT APLICACIONES
      ========================== */
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'mb-4';

      const labelAplicaciones = document.createElement('label');
      labelAplicaciones.className = 'form-label';
      labelAplicaciones.textContent = 'Aplicación';

      const selectAplicaciones = document.createElement('select');
      selectAplicaciones.id = 'aplicaciones-perfil';
      selectAplicaciones.className = 'js-select2 form-control';
      selectAplicaciones.style.width = '100%';
      selectAplicaciones.disabled = true;

      // Opción loading
      const loadingOption = document.createElement('option');
      loadingOption.value = '';
      loadingOption.textContent = 'Cargando aplicaciones...';
      selectAplicaciones.appendChild(loadingOption);

      selectWrapper.appendChild(labelAplicaciones);
      selectWrapper.appendChild(selectAplicaciones);

      newPerfilContent.appendChild(nombreWrapper);
      newPerfilContent.appendChild(selectWrapper);

      this.getModalPerfil
        .querySelector('.block-content')
        .appendChild(newPerfilContent);

      /* =========================
        MOSTRAR MODAL
      ========================== */
      const modal = new bootstrap.Modal(this.getModalPerfil);
      modal.show();

      /* =========================
        INICIALIZA SELECT2 (LOADING)
      ========================== */
      $('#aplicaciones-perfil').select2({
        placeholder: 'Seleccione una aplicación..',
        dropdownParent: $('#perfilModal'),
        width: '100%'
      });

      /* =========================
        CARGA DE DATOS
      ========================== */
      aplicaciones.then(data => {

        // Limpiar opciones
        selectAplicaciones.innerHTML = '';

        // Placeholder real
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '';
        selectAplicaciones.appendChild(placeholder);

        // Opciones reales
        data.aplicaciones.forEach(app => {
          const option = document.createElement('option');
          option.value = app.id;
          option.textContent = app.name;
          selectAplicaciones.appendChild(option);
        });

        // Habilitar select
        selectAplicaciones.disabled = false;
        //selectAplicaciones.classList.remove('select-loading');

        // Refrescar select2
        $('#aplicaciones-perfil')
          .val(null)
          .trigger('change.select2');

      }).catch(error => {
        console.error('Error cargando aplicaciones:', error);
      });
    }

    static async storePerfil(event) {
        event.preventDefault();

        const select = jQuery('.js-select2');
        const valor = select.val();

        if (!valor) {
          select.next('.select2-container')
            .find('.select2-selection')
            .addClass('error');

          return;
        } else {
          select.next('.select2-container')
            .find('.select2-selection')
            .removeClass('error');
        }

        if (!jQuery('#perfilForm').valid()) {
          // Si la validación falla, detén el proceso y no envíes el formulario
          //console.log('El formulario contiene campos que deben ser validados, no se enviará.');
          return;
        }

        const nombrePerfil = document.getElementById('nombre-perfil').value;
        const aplicacionSeleccionada = jQuery('#aplicaciones-perfil').val();

        const formData = {
          nombre_perfil: nombrePerfil,
          aplicacion: aplicacionSeleccionada
        }

        //console.log(formData);

        this.toast.fire({
          title: '¿Esta seguro?',
          text: 'Se enviaran los datos del formulario para la creación del perfil',
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
                        this.showToast('Error...', `Error al enviar datos del perfil ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();

                    // cerrar modal this.getModalCargo
                    const modalInstance = bootstrap.Modal.getInstance(this.getModalPerfil);
                    modalInstance.hide();

                    // mostrar toast exito
                    this.showToast('Exito', 'Perfil creado exitosamente', 'success');

                    // recargar datatable
                    this.recargarTabla();

                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar datos del perfil ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });

    }
  
    static async fetchPerfil(perfilId) {
      if (!perfilId) {
        this.showToast(
          "Error",
          "No se pudo cargar los datos del perfil",
          "error"
        );
        return;
      }
  
      try {
        const response = await fetch(`/getPerfilesApp?perfilId=${perfilId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok)
          throw new Error("Error al obtener los datos del perfil");
  
        const data = await response.json();
        //console.log(data);
        if (!data.perfilApp) {
          throw new Error("Datos incompletos recibidos del servidor");
        }

        this.showModalEditPerfil(data.perfilApp, this.fetchAplicaciones());
      } catch (error) {
        this.showToast("Error", `${error}`, "error");
        console.error("Fetch error:", error);
      }
    }

    static async showModalEditPerfil(perfilApp, aplicaciones) {
      //console.log(perfilApp);
      this.submitForm.dataset.mode = 'edit';

      this.titleModalPerfil.textContent = "Editar Perfil";
      this.perfilId.value = perfilApp.perfil_id;

      // Eliminar contenido anterior si existe
      const prevContentEditPerfilApp = this.getModalPerfil.querySelector("#editPerfilAppContent");
      if (prevContentEditPerfilApp) prevContentEditPerfilApp.remove();

      // Crear nuevo contenido
      const PerfilAppContent = document.createElement("div");
      PerfilAppContent.id = "editPerfilAppContent";

      /* =========================
        INPUT NOMBRE PERFIL
      ========================== */
      const nombreWrapper = document.createElement('div');
      nombreWrapper.className = 'mb-4';

      const nombreLabel = document.createElement('label');
      nombreLabel.className = 'form-label';
      nombreLabel.textContent = 'Nombre del Perfil';

      const nombreInput = document.createElement('input');
      nombreInput.type = 'text';
      nombreInput.className = 'form-control';
      nombreInput.id = 'nombre-perfil-edit';
      nombreInput.name = 'nombre-perfil-edit';
      nombreInput.value = perfilApp.name;
      nombreInput.placeholder = 'Ingrese el nombre del perfil';

      nombreWrapper.appendChild(nombreLabel);
      nombreWrapper.appendChild(nombreInput);

      /* =========================
        SELECT APLICACIONES
      ========================== */
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'mb-4';

      const labelAplicaciones = document.createElement('label');
      labelAplicaciones.className = 'form-label';
      labelAplicaciones.textContent = 'Aplicación';

      const selectAplicaciones = document.createElement('select');
      selectAplicaciones.id = 'aplicaciones-perfil-edit';
      selectAplicaciones.className = 'js-select2 form-control';
      selectAplicaciones.style.width = '100%';
      selectAplicaciones.disabled = true;

      // Opción loading
      const loadingOption = document.createElement('option');
      loadingOption.value = '';
      loadingOption.textContent = 'Cargando aplicaciones...';
      selectAplicaciones.appendChild(loadingOption);

      selectWrapper.appendChild(labelAplicaciones);
      selectWrapper.appendChild(selectAplicaciones);

      PerfilAppContent.appendChild(nombreWrapper);
      PerfilAppContent.appendChild(selectWrapper);

      this.getModalPerfil
        .querySelector('.block-content')
        .appendChild(PerfilAppContent);

      /* =========================
        MOSTRAR MODAL
      ========================== */
      const modal = new bootstrap.Modal(this.getModalPerfil);
      modal.show();

      /* =========================
        INICIALIZA SELECT2 (LOADING)
      ========================== */
      $('#aplicaciones-perfil-edit').select2({
        placeholder: 'Seleccione una aplicación..',
        dropdownParent: $('#perfilModal'),
        width: '100%'
      });

      /* =========================
        CARGA DE DATOS
      ========================== */
      aplicaciones.then(data => {

        // Limpiar opciones
        selectAplicaciones.innerHTML = '';

        // Placeholder real
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '';
        selectAplicaciones.appendChild(placeholder);

        // Opciones reales
        data.aplicaciones.forEach(app => {
          const option = document.createElement('option');
          option.value = app.id;
          option.textContent = app.name;
          selectAplicaciones.appendChild(option);
        });

        // Habilitar select
        selectAplicaciones.disabled = false;
        //selectAplicaciones.classList.remove('select-loading');

        // Determinar el id de la aplicación del perfil (varias posibles propiedades)
        let selectedAppId = null;
        if (perfilApp) {
          selectedAppId =
          perfilApp.aplicacion_id ??
          perfilApp.aplicacion ??
          (perfilApp.aplicacion && perfilApp.aplicacion.id) ??
          perfilApp.aplicacionId ??
          perfilApp.app_id ??
          perfilApp.appId ??
          null;

          // si vino como objeto extraer id
          if (typeof selectedAppId === 'object' && selectedAppId !== null) {
              selectedAppId = selectedAppId.id ?? selectedAppId.value ?? null;
          }

          if (selectedAppId !== null) selectedAppId = String(selectedAppId);
        }

        // Refrescar select2 y seleccionar la opción correspondiente si existe
        $('#aplicaciones-perfil-edit')
          .val(selectedAppId ? selectedAppId : null)
          .trigger('change.select2');

      }).catch(error => {
        console.error('Error cargando aplicaciones:', error);
      });
    }

    static async updateCargo(event) {
        event.preventDefault();

        const select = jQuery('.js-select2');
        const valor = select.val();

        if (!valor) {
          select.next('.select2-container')
            .find('.select2-selection')
            .addClass('error');

          return;
        } else {
          select.next('.select2-container')
            .find('.select2-selection')
            .removeClass('error');
        }

        if (!jQuery('#perfilForm').valid()) {
          // Si la validación falla, detén el proceso y no envíes el formulario
          //console.log('El formulario contiene campos que deben ser validados, no se enviará.');
          return;
        }

        const nombrePerfil = document.getElementById('nombre-perfil-edit').value;
        const aplicacionSeleccionada = jQuery('#aplicaciones-perfil-edit').val();

        const formData = {
          nombre_perfil: nombrePerfil,
          aplicacion: aplicacionSeleccionada
        }

        //console.log(formData);

        this.toast.fire({
          title: 'Esta seguro?',
          text: 'Se enviaran los datos del formulario para la actualización del perfil!',
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
                    const response = await fetch(`${'/editPerfilApp/' + this.perfilId.value}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        this.showToast('Error...', `Error al enviar formulario para actualizar el perfil ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();

                    // cerrar modal this.getModalPerfil
                    const modalInstance = bootstrap.Modal.getInstance(this.getModalPerfil);
                    modalInstance.hide();

                    // mostrar toast exito
                    this.showToast('Exito', 'Perfil actualizado exitosamente', 'success');
                    // recargar datatable
                    this.recargarTabla();

                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar formulario perfil ${error}`, 'error');
                }
            } else if (result.dismiss === 'cancel') {
                //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
            }
        });

    }

    static async activatePerfil(event, perfilId, perfilNombre) {
      event.preventDefault();

      const formData = {
        perfil_id: perfilId,
      }

      //console.log(formData);

      this.toast.fire({
        title: '¿Esta seguro?',
        text: `¿Desea activar el perfil ${perfilNombre}?`,
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
                  const response = await fetch(`${'/activatePerfil/' + perfilId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                      },
                      body: JSON.stringify(formData)
                  });

                  if (!response.ok) {
                      this.showToast('Error...', `Error al enviar datos para activar el perfil ${response.statusText}`, 'error');
                      throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                  }

                  // mostrar toast exito
                  this.showToast('Exito', 'Perfil activado exitosamente', 'success');

                  // recargar datatable
                  this.recargarTabla();

              } catch (error) {
                  console.error('Error al enviar los datos del perfil:', error);
                  this.showToast('Error...', `Error al enviar los datos del perfil ${error}`, 'error');
              }
          } else if (result.dismiss === 'cancel') {
              //toast.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
          }
      });
    }

    static async inactivatePerfil(event, perfilId, perfilNombre) {
      event.preventDefault();

      const formData = {
        perfil_id: perfilId,
      }

      //console.log(formData);

      this.toast.fire({
      title: '¿Esta seguro?',
      text: `¿Desea inactivar el perfil ${perfilNombre}?`,
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
                  const response = await fetch(`${'/inactivatePerfil/' + perfilId}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                      },
                      body: JSON.stringify(formData)
                  });

                  if (!response.ok) {
                      this.showToast('Error...', `Error al enviar datos para inactivar el perfil ${response.statusText}`, 'error');
                      throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                  }

                  // mostrar toast exito
                  this.showToast('Exito', 'Perfil inactivado exitosamente', 'success');

                  // recargar datatable
                  this.recargarTabla();

              } catch (error) {
                  console.error('Error al enviar los datos del perfil:', error);
                  this.showToast('Error...', `Error al enviar los datos del perfil ${error}`, 'error');
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
          url: "/fetchPerfilList",
          type: "GET",
          dataSrc: "perfiles",
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
          { data: "nombre_perfil" },
          { data: "aplicacion" },
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
                data-perfil-id="${row.perfil_id}"
                data-perfil-nombre="${row.nombre_perfil}">
                <i class="fa fa-times"></i>
              </button>
            ` : `
              <button type="button" class="btn btn-sm btn-success btn-activate"
                data-toggle="click-ripple" data-bs-toggle="tooltip" title="Activar"
                data-perfil-id="${row.perfil_id}"
                data-perfil-nombre="${row.nombre_perfil}">
                <i class="fa fa-check"></i>
              </button>
            `}
            <button type="button" class="btn btn-sm btn-secondary btn-edit"
              data-toggle="click-ripple" data-bs-toggle="tooltip" title="Actualizar"
              data-perfil-id="${row.perfil_id}">
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
                const aplicacion = div.textContent || div.innerText || "";
                //console.log(aplicacion.trim());
  
                // Asignar clase según el aplicacion
                let badgeClass = "badge bg-info w-100"; // Clase por defecto
                let icon = ""; // Icono por defecto
  
                return `<span class="${badgeClass}"><i class="${icon} me-1"></i>${aplicacion.trim()}</span>`;
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
      "#perfilesTable_wrapper .row.mt-2.justify-content-between"
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
        "#perfilesTable_wrapper .row.mt-2.justify-content-between"
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
      this.openModalPerfil();
      this.initDataTables();
      this.submitForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const mode = this.submitForm.dataset.mode;

        if (mode === 'create') {
          this.storePerfil(event);
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