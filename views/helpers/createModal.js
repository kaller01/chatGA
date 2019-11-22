const createModal = (id,header,body,button)=>{
  let html = `
  <!-- Modal -->
    <div class="modal fade" id="modal${id}" tabindex="-1" role="dialog" aria-labelledby="modal${header}" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel${id}">${header}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modal${header}">
                    ${body}
                    <p class="error" style="display:none;" id=error${id}>Error</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="modalButton${id}">${button}</button>
                </div>
            </div>
        </div>
    </div>
  `;
return html;

};

module.exports = {
    createModal: createModal
};