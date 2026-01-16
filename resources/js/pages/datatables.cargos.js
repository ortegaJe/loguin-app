/*
 *  Document   : datatables.js
 *  Author     : pixelcave
 *  Description: Using custom JS code to init DataTables plugin
 */

// DataTables, for more examples you can check out https://www.datatables.net/
class pageTablesDatatables {
    static initElements() {
      this.submitForm = document.getElementById("newCargoForm");
      this.getModal = document.getElementById("solicitudModal");
      this.cargoIdModal = document.getElementById("cargoIdModal");
      this.titleModal = document.getElementById("solicitudModalTitle");
      this.newCargoBtn = document.getElementById("newCargoBtn");
      this.getModalNewCargo = document.getElementById("newCargoModal");
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

    static openModalNewCargo() {
      this.newCargoBtn.addEventListener("click", () => {
        // Abrir modal para agregar nuevo cargo con el id newCargoModal
        this.showModalNewCargo();
      });
    }

    static showModalNewCargo() {
      // Eliminar contenido anterior si existe
      const prevContent = this.getModalNewCargo.querySelector("#newCargoContent");
      if (prevContent) prevContent.remove();

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

      this.getModalNewCargo.querySelector(".block-content").appendChild(newCargoContent);

      const modal = new bootstrap.Modal(this.getModalNewCargo);
      modal.show();
    }
  
    static SolicitudDetalleViewer() {
      const table = document.getElementById("solicitudesTable");
  
      table.addEventListener("click", (event) => {
        const button = event.target.closest(".btn-show");
        const btnRegisterLoguin = event.target.closest(".btn-register-loguin");
  
        if (button) {
          const solicitudId = button.getAttribute("data-cargo-id");
          const usuarioId = button.getAttribute("data-usuario-id");
  
          this.fetchSolicitudLoguinData(solicitudId);
        }
  
        if (btnRegisterLoguin) {
          const loguinSolicitudId =
            btnRegisterLoguin.getAttribute("data-solicitud-id");
          const url = `/loguin/aplicaciones/solicitud/registrar/${loguinSolicitudId}`;
          window.open(url, "_blank");
        }
      });
    }
  
    static async fetchSolicitudLoguinData(cargoId) {
      if (!cargoId) {
        this.showToast(
          "Error",
          "No se pudo cargar los datos del cargo",
          "error"
        );
        return;
      }
  
      try {
        const response = await fetch(`/getOpcionesCargoInfra?cargoId=${cargoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok)
          throw new Error("Error al obtener los datos del cargo");
  
        const data = await response.json();
        //console.log(data);
        if (!data.opcionesInfra) {
          throw new Error("Datos incompletos recibidos del servidor");
        }
  
        this.showSolicitudModal(data.opcionesInfra);
      } catch (error) {
        this.showToast("Error", `${error}`, "error");
        console.error("Fetch error:", error);
      }
    }
  
    static async showSolicitudModal(opcionesInfra) {
      //console.log(opcionesInfra);

      this.cargoIdModal.value = opcionesInfra.cargo_id;
      this.titleModal.textContent = opcionesInfra.name;

      // Eliminar contenido anterior si existe
      const prevContent = this.getModal.querySelector("#OpcionesInfraContent");
      if (prevContent) {
        prevContent.remove();
      }

      // Crear nuevo contenido
      const opcionesInfraContent = document.createElement("div");
      opcionesInfraContent.className = "row g-3";
      opcionesInfraContent.id = "OpcionesInfraContent";

      const opciones = [
        {
          id: "correo-institucional",
          name: "correo-institucional",
          icon: "fa-envelope",
          tooltip: "Correo institucional",
          checked: opcionesInfra.sw_correo,
        },
        {
          id: "usuario-dominio",
          name: "usuario-dominio",
          icon: "fa-user-circle",
          tooltip: "Usuario de dominio",
          checked: opcionesInfra.sw_dominio,
        },
        {
          id: "vpn",
          name: "vpn",
          icon: "fa-globe",
          tooltip: "VPN",
          checked: opcionesInfra.sw_vpn,
        },
      ];

      opciones.forEach((opcion) => {
        //console.log(opcion.checked); 
        const colDiv = document.createElement("div");
        colDiv.className = "col-6 col-sm-4";

        const formCheckDiv = document.createElement("div");
        formCheckDiv.className = "form-check form-block";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = opcion.id;
        input.name = opcion.name;
        input.checked = opcion.checked === 1 ? true : false;

        const label = document.createElement("label");
        label.className = "form-check-label bg-body-light text-center";
        label.htmlFor = opcion.id;
        label.setAttribute("data-bs-toggle", "tooltip");
        label.setAttribute("data-bs-placement", "top");
        label.setAttribute("data-bs-original-title", opcion.tooltip);

        const icon = document.createElement("i");
        icon.className = `fa ${opcion.icon} fa-2x text-muted me-1`;

        label.appendChild(icon);
        formCheckDiv.appendChild(input);
        formCheckDiv.appendChild(label);
        colDiv.appendChild(formCheckDiv);
        opcionesInfraContent.appendChild(colDiv);
      });

      this.getModal.querySelector(".block-content").appendChild(opcionesInfraContent);
  
      const modalInstance = new bootstrap.Modal(this.getModal);
      modalInstance.show();
    }

    static async handleSubmit(event) {
        event.preventDefault();

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
                        this.showToast('Error...', `Error al enviar Formulario Cargo ${response.statusText}`, 'error');
                        throw new Error(`Error en la respuesta del servidor: ${response.statusText} - ${response.status}`);
                    }

                    const result = await response.json();

                    // cerrar modal this.getModalNewCargo
                    const modalInstance = bootstrap.Modal.getInstance(this.getModalNewCargo);
                    modalInstance.hide();

                    // mostrar toast exito
                    this.showToast('Exito', 'Cargo creado exitosamente', 'success');

                    // recargar datatable
                    const table = jQuery('.js-dataTable-full').DataTable();
                    table.ajax.reload(null, false); // false evita que se reinicie la paginación

                } catch (error) {
                    console.error('Error al enviar el formulario:', error);
                    this.showToast('Error...', `Error al enviar formulario cargo ${error}`, 'error');
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
              return `
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-danger"
                    data-toggle="click-ripple" data-bs-toggle="tooltip" title="Inactivar"
                    data-solicitud-id="${row.cargo_id}"
                    data-usuario-id="">
                    <i class="fa fa-times"></i>
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary btn-show"
                    data-toggle="click-ripple" data-bs-toggle="tooltip" title="Ver Solicitudes"
                    data-cargo-id="${row.cargo_id}">
                    <i class="fa fa-tags"></i>
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
          const table = jQuery(".js-dataTable-full").DataTable();
          table.ajax.reload(null, false); // false evita que se reinicie la paginación
  
          // Actualizar todas las cards
          //await pageTablesDatatables.getCountTickets();
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
      this.initDataTables();
      this.SolicitudDetalleViewer();
      this.openModalNewCargo();
      this.submitForm.addEventListener('submit', (event) => this.handleSubmit(event));
      //this.getCountTickets();
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