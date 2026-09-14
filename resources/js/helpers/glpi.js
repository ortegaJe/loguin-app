export function glpiTicketUrl(ticketId) {
    if (!ticketId) {
        return null;
    }

    return `${window.appConfig.glpi.url}/front/ticket.form.php?id=${ticketId}`;
}