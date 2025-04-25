/*
 *  Document   : datatables.js
 *  Author     : pixelcave
 *  Description: Using custom JS code to init DataTables plugin
 */

// DataTables, for more examples you can check out https://www.datatables.net/
class pageTablesDatatables {
  static initElements() {
    this.cardRow = document.getElementById("countTicketCard");
    this.enCursoCount = document.getElementById("enCursoCount");
    this.respuestaCount = document.getElementById("respuestaCount");
    this.cerradoCount = document.getElementById("cerradoCount");
  }

  static SolicitudDetalleViewer() {
    const table = document.getElementById("solicitudesTable");

    table.addEventListener("click", (event) => {
      const button = event.target.closest(".btn-show");
      const btnRegisterLoguin = event.target.closest(".btn-register-loguin");

      if (button) {
        const solicitudId = button.getAttribute("data-solicitud-id");
        const usuarioId = button.getAttribute("data-usuario-id");

        this.fetchSolicitudLoguinData(solicitudId, usuarioId);
      }

      if (btnRegisterLoguin) {
        const loguinSolicitudId =
          btnRegisterLoguin.getAttribute("data-solicitud-id");
        const url = `/loguin/aplicaciones/solicitud/registrar/${loguinSolicitudId}`;
        window.open(url, "_blank");
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

  static async fetchSolicitudLoguinData(solicitudId, usuarioId) {
    if (!solicitudId) {
      this.showToast(
        "Error",
        "No se pudo cargar los datos de la solicitud",
        "error"
      );
      return;
    }

    try {
      const response = await fetch("/fetchSolicitudLoguin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        body: JSON.stringify({
          solicitud_id: solicitudId,
          usuario_id: usuarioId,
        }),
      });

      if (!response.ok)
        throw new Error("Error al obtener los datos de la solicitud");

      const data = await response.json();
      //console.log(data);
      if (
        !data.usuario ||
        !data.usuario[0] ||
        !data.loguin_solicitud ||
        !data.especialidad_usuario
      ) {
        throw new Error("Datos incompletos recibidos del servidor");
      }

      this.showSolicitudModal(
        data.usuario[0],
        data.loguin_solicitud,
        data.especialidad_usuario
      );
    } catch (error) {
      this.showToast("Error", `${error}`, "error");
      console.error("Fetch error:", error);
    }
  }

  static async showSolicitudModal(
    usuario,
    loguinSolicitud,
    especialidadUsuario
  ) {
    //console.log(loguinSolicitud);

    const modal = document.getElementById("solicitudModal");
    modal.querySelector("#modal-documento").textContent = usuario.identificacion || "N/A";
    modal.querySelector("#modal-nombre").textContent = usuario.nombreCompleto || "N/A";
    modal.querySelector("#modal-email").textContent = usuario.email || "N/A";
    modal.querySelector("#modal-zonal").textContent = usuario.zonal || "N/A";
    modal.querySelector("#modal-sede").textContent = usuario.sede || "N/A";
    modal.querySelector("#modal-ticket").href =
      `http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${usuario.ticket_id}` ||
      "N/A";
    modal.querySelector("#modal-ticket").setAttribute("target", "_blank");
    modal.querySelector("#modal-ticket-numero").textContent = `#${usuario.ticket_id}` || "N/A";
    modal.querySelector("#modal-fecha").textContent = usuario.fecha_creacion || "N/A";
    modal.querySelector("#modal-observacion").textContent = usuario.observaciones;

    const aplicacionesPerfilesContainer = modal.querySelector(
      "#modal-aplicaciones-perfiles"
    );
    aplicacionesPerfilesContainer.innerHTML = "";

    loguinSolicitud.map((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = `${item.aplicacion} ${item.perfil.toUpperCase()}`;
      aplicacionesPerfilesContainer.appendChild(listItem);
    });

    const perfilesEspecialistaId = [5, 6]; // ID desde la base de datos medicos especilistas de everest y pana
    const hasMedicoEspecialista = loguinSolicitud.some((item) =>
      perfilesEspecialistaId.includes(item.perfil_id)
    );
    const hasEspecialidad =
      especialidadUsuario && especialidadUsuario.length > 0;

    if (hasMedicoEspecialista || hasEspecialidad) {
      const titleEspecialidadUsuario = modal.querySelector(
        "#title-especialidad"
      );
      const especialidadUsuarioContainer = modal.querySelector(
        "#modal-especialidad-usuario"
      );
      titleEspecialidadUsuario.hidden = false;
      especialidadUsuarioContainer.hidden = false;
      especialidadUsuarioContainer.innerHTML = "";

      if (hasEspecialidad) {
        especialidadUsuario.forEach((item) => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item");
          listItem.textContent = `${item.especialidad}`;
          especialidadUsuarioContainer.appendChild(listItem);
        });
      }
    } else {
      modal.querySelector("#title-especialidad").hidden = true;
      modal.querySelector("#modal-especialidad-usuario").hidden = true;
    }

    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  }

  static async getCountTickets() {
    try {
      const response = await fetch("/getCountTickets", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
      });

      if (!response.ok)
        throw new Error("Error al obtener los datos de la solicitud");

      const data = await response.json();
      //console.log(data);
      if (!data) {
        throw new Error("Datos incompletos recibidos del servidor");
      }

      this.renderTodosLosTickets(
        data.countByStatus,
        data.countByTicketCloseUser
      );
    } catch (error) {
      this.showToast("Error", `${error}`, "error");
      console.error("Fetch error:", error);
    }
  }

  static renderTodosLosTickets(statusTickets, ticketsPorUsuario) {
    const { en_curso, respuesta, cerrados } = statusTickets;

    const tarjetasFijas = `
      <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
        <a class="block block-rounded block-link-shadow" href="javascript:void(0)">
          <div class="block-content block-content-full">
            <div class="py-3 text-center">
              <div class="mb-3"><i class="far fa-circle fa-4x text-success"></i></div>
              <div class="fs-3 fw-semibold">${en_curso}</div>
              <div class="fs-sm fw-semibold text-uppercase text-muted">En Curso</div>
            </div>
          </div>
        </a>
      </div>
  
      <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
        <a class="block block-rounded block-link-shadow" href="javascript:void(0)">
          <div class="block-content block-content-full">
            <div class="py-3 text-center">
              <div class="mb-3"><i class="far fa-comment fa-4x text-secondary"></i></div>
              <div class="fs-3 fw-semibold">${respuesta}</div>
              <div class="fs-sm fw-semibold text-uppercase text-muted">Respuesta</div>
            </div>
          </div>
        </a>
      </div>
  
      <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
        <a class="block block-rounded block-link-shadow" href="javascript:void(0)">
          <div class="block-content block-content-full">
            <div class="py-3 text-center">
              <div class="mb-3"><i class="fa fa-check fa-4x text-info"></i></div>
              <div class="fs-3 fw-semibold">${cerrados}</div>
              <div class="fs-sm fw-semibold text-uppercase text-muted">Cerrados</div>
            </div>
          </div>
        </a>
      </div>
    `;

    const tarjetasUsuarios = ticketsPorUsuario
      .map(
        (tickets) => `
      <div class="col-6 col-md-4 col-xl-2 animated fadeIn">
        <a class="block block-rounded block-link-shadow" href="javascript:void(0)">
          <div class="block-content block-content-full">
            <div class="py-3 text-center">
              <div class="mb-3"><i class="far fa-user fa-4x text-primary"></i></div>
              <div class="fs-3 fw-semibold">${tickets.cerrados}</div>
              <div class="fs-sm fw-semibold text-uppercase text-muted">
                ${tickets.analista_app == null ? null : tickets.analista_app}
              </div>
            </div>
          </div>
        </a>
      </div>
    `
      )
      .join("");

    // Render todo en una sola fila
    this.UsuarioCount = this.cardRow;
    this.UsuarioCount.innerHTML = tarjetasFijas + tarjetasUsuarios;
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
        url: "/fetchSolicitudesLoguin",
        type: "GET",
        dataSrc: "loguinAplicaciones",
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
        { data: "ticket_id" },
        { data: "status_title" },
        { data: "fecha_creacion" },
        { data: "identificacion" },
        { data: "nombreCompleto" },
        {
          data: null,
          orderable: false,
          searchable: false,
          className: "text-center",
          render: function (data, type, row) {
            return `
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-secondary btn-show"
                  data-toggle="click-ripple" data-bs-toggle="tooltip" title="Ver detalle"
                  data-solicitud-id="${row.solicitud_id}"
                  data-usuario-id="${row.usuario_id}">
                  <i class="fa fa-eye"></i>
                </button>
                <button type="button" class="btn btn-sm btn-secondary btn-register-loguin"
                  data-toggle="click-ripple" data-bs-toggle="tooltip" title="Registrar credenciales"
                  data-solicitud-id="${row.solicitud_id}">
                  <i class="fa fa-user-pen"></i>
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
          targets: 1,
          render: function (data, type, row) {
            if (type === "display") {
              return `<a class="fw-semibold" href="http://mesadeservicios.viva1a.com.co/glpi/front/ticket.form.php?id=${row.ticket_id}" target="_blank">LOG.${row.ticket_id}</a>`;
            }
            return data;
          },
        },
        {
          targets: 2,
          render: function (data, type, row) {
            if (type === "display") {
              const div = document.createElement("div");
              div.innerHTML = data;
              const estado = div.textContent || div.innerText || "";
              //console.log(estado.trim());

              // Asignar clase según el estado
              let badgeClass = "badge bg-info w-100"; // Clase por defecto
              let icon = ""; // Icono por defecto
              if (estado.trim() === "Cerrado") {
                badgeClass = "badge bg-info w-100";
                icon = "fa fa-check";
              } else if (estado.trim() === "En curso") {
                badgeClass = "badge bg-success w-100";
                icon = "far fa-circle";
              } else if (estado.trim() === "Respuesta") {
                badgeClass = "badge bg-secondary w-100";
                icon = "far fa-comment";
              }

              return `<span class="${badgeClass}"><i class="${icon} me-1"></i>${estado.trim()}</span>`;
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
              return `<span class="fw-semibold dt-type-numeric">${data}</span>`;
            }
            return data;
          },
        },
        {
          targets: 5,
          render: function (data, type, row) {
            if (type === "display") {
              return `<span class="fw-semibold d-none d-md-table-cell">${data}</span>`;
            }
            return data;
          },
        },
      ],
    });

    table.on("length.dt", function (e, settings, len) {
      localStorage.setItem("datatable_length", len);
    });

    // Insertar filtro de estado
    const estadoFilterHTML = `
      <div class="col-md-auto me-auto">
        <select id="filter-estado" class="form-select form-select">
          <option value="">Todos</option>
          <option value="En curso">En curso</option>
          <option value="Cerrado">Cerrado</option>
          <option value="Respuesta">Respuesta</option>
        </select>
      </div>
    `;

    // Insertar el filtro después del page length
    const filtroRow = document.querySelector(
      "#solicitudesTable_wrapper .row.mt-2.justify-content-between"
    );
    if (filtroRow) {
      const temp = document.createElement("div");
      temp.innerHTML = estadoFilterHTML;
      const filtroEstadoDiv = temp.firstElementChild;

      const children = filtroRow.children;
      if (children.length >= 1) {
        // Insertar como segundo hijo
        filtroRow.insertBefore(filtroEstadoDiv, children[1]);
      } else {
        // Si no hay hijos, insertar simplemente
        filtroRow.appendChild(filtroEstadoDiv);
      }
    }

    // Filtro de estado
    const estadoSelect = document.getElementById("filter-estado");
    if (estadoSelect) {
      estadoSelect.addEventListener("change", function () {
        const value = this.value;
        table.column(2).search(value).draw(); // columna "ESTADO"
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
        filtroRowRefresh.insertBefore(refreshBtnDiv, children[3]);
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
        await pageTablesDatatables.getCountTickets();
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
    this.getCountTickets();
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
