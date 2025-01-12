class CustomDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .dialog-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .dialog {
          background: black;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          color: white;
          border: 2px dotted white;
        }
        .dialog-header {
          font-size: 1.25em;
          margin-bottom: 10px;
        }
        .dialog-body {
          margin-bottom: 20px;
        }
        .dialog-footer {
          display: flex;
          justify-content: flex-end;
        }
        .dialog-footer button {
          margin-left: 10px;
          background: white;
          color: black;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .dialog-footer button:hover {
          background: #f0f0f0;
        }
      </style>
      <div class="dialog-backdrop">
        <div class="dialog">
          <div class="dialog-header">
            <slot name="title"></slot>
          </div>
          <div class="dialog-body">
            <slot name="body"></slot>
          </div>
          <div class="dialog-footer">
            <button id="cancel-button">Cancel</button>
            <button id="confirm-button">Confirm</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('cancel-button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cancel'));
      this.remove();
    });

    this.shadowRoot.getElementById('confirm-button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('confirm'));
      this.remove();
    });
  }
}

customElements.define('custom-dialog', CustomDialog);