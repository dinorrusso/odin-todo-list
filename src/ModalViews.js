//ModalViews.js
export class ModalView {
  constructor(title, contentHtml, onSaveCallback) {
    this.title = title;
    this.contentHtml = contentHtml;
    this.onSaveCallback = onSaveCallback;
    this.modalElement = null;
    this.render();
  }

  render() {
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('modal-overlay');
    this.modalElement.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${this.title}</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          ${this.contentHtml}
        </div>
        <div class="modal-footer">
          <button class="modal-save">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalElement);
    this.addEventListeners();
  }

  addEventListeners() {
    this.modalElement.querySelector('.modal-close').addEventListener('click', () => {
      this.close();
    });

    this.modalElement.querySelector('.modal-save').addEventListener('click', () => {
      const input = this.modalElement.querySelector('.modal-input').value;
      if (this.onSaveCallback) {
        this.onSaveCallback(input);
      }
      this.close();
    });
  }

  close() {
    if (this.modalElement) {
      this.modalElement.remove();
    }
  }
}