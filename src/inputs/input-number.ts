import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement, ITextBasedInputElement } from "./core/InputElement.js";
import { clear as clearIcon } from '../assets/icons.js';
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputModeType } from './core/InputModeType.js';


const regex = {
    spaces: /\s+/g,
    validChars: /[^0-9,.+\- ]/g,
    decimalSeparator: /\.|\,/
}


const converterNumberOrNull = (attributeName: string, v: string | null): number | null => {
    if (v !== null) {
        const n = parseFloat(v);

        if (!isNaN(n)) {
            return n;
        } else {
            console.error(`InputNumberElement - convert attribute ${attributeName} unexpected value.`)
            return null;
        }
    } else {
        return null;
    }
}


export type NumberValue = number;


@customElement('input-number')
export class InputNumberElement extends InputElement<NumberValue> implements ITextBasedInputElement<NumberValue> {

    // Properties
    readonly defaultValue: NumberValue = 0;

    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('min', v),
    })
    min: number | null = null;


    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('max', v),
    })
    max: number | null = null;


    // return step;
    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('step', v),
    })
    step: number | null = null;


    @property({ type: Number })
    value: NumberValue = 0;


    @property({ attribute: true, converter: (v) => v?.trim() != "" ? v : null })
    placeholder: string | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, type: String })
    autocomplete: AutocompleteType = AutocompleteType.Off;


    @property({ attribute: true })
    inputMode: InputModeType = InputModeType.Default;


    private _computeInputMode(): InputModeType {
        if (this.inputMode === InputModeType.Default) {
            return Number.isInteger(this.step) ? InputModeType.Decimal : InputModeType.Numeric;
        } else {
            return this.inputMode;
        }
    };


    @query('#input')
    private _input!: HTMLInputElement;



    private _onInput() {
        const rawValue = this._input.value;

        const rawParts = rawValue.split(regex.decimalSeparator);
        if (rawParts.length == 1) {
            rawParts.push('');
        } else if (rawParts.length >= 3) {
            rawParts[1] = rawParts.slice(1).join('');
        }

        rawParts.splice(2);

        const parts = rawParts.map(v => {
            return v.replace(regex.validChars, '')
                .replace(regex.spaces, '')
                .replace(regex.decimalSeparator, '')
                .replace('+', '');
        });

        const value: string = [
            parts[0].length != 0 ? parts[0] : 0,
            parts[1].length != 0 ? parts[1] : 0,
        ].join('.');

        const n = parseFloat(value);
        this._updateValue(n);
    }


    private _onBlur() {
        this._input.value = this._formatValue(this.value);
    }


    private _onKeyDown(e: KeyboardEvent) {
        const increment = (direction: -1 | 1) => {
            e.preventDefault();

            const v: number = this.step ?? 1;
            this._updateValue((this.value ?? 0) + (v * (e.shiftKey ? 10 : 1) * direction));
        }

        switch (e.key) {
            case 'ArrowUp': increment(1); break;
            case 'ArrowDown': increment(-1); break;
        }
    }


    private _onClearValue() {
        this.clearValue();
        this.focus();
    }


    private _updateValue(value: NumberValue): void {
        if (value != null) {
            if (this.max != null) value = Math.min(value, this.max);
            if (this.min != null) value = Math.max(value, this.min);
        }

        this.value = InputNumberElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    private _formatValue(n: NumberValue): string {
        return n?.toString().replace('.', ',') ?? '';
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: NumberValue): boolean {
        return this.value === value;
    }


    focus() {
        this._input.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
        this.fireBlurEvent();
    }


    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            box-sizing: border-box;
        }

        #container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: stretch;
            overflow: hidden;
            border: 2px solid;
            border-radius: 6px;

            color: var(--system-color-label);
            background-color: var(--system-color-base);
            border-color: var(--system-color-gray2);
        }

        #container:focus-within {
            border-color: var(--system-color-gray1);
        }

        #container[disabled] {
            color: var(--system-color-gray3);
            background-color: var(--system-color-gray6);
            border-color: var(--system-color-gray4);
        }

        input {
            display: block;
            flex-shrink: 1;
            flex-grow: 1;
            width: auto;
            height: 100%;
            max-width: 100%;
            min-width: 0%;
            max-height: 100%;
            min-height: 32px;
            box-sizing: border-box;
            border: none;
            outline: 0;
            outline: none;
            padding: 0;
            margin: 0;
            padding: 4px 6px;
            font-family: inherit;
            font-size: 18px;
            line-height: 24px;
            color: inherit;
            background-color: inherit;
            text-align: right;
        }

        
        input::placeholder {
            color: var(--system-color-gray3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .clear-button {
            outline: 0;
            cursor: pointer;
            margin: 4px;
            flex-shrink: 0;
            color: var(--system-color-gray2);
        }

        .clear-button:hover,
        .clear-button:focus {
            color: var(--system-color-gray1);
        }

        #container[disabled] .clear-button,
        #container:not([filled]) .clear-button {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
                <div class="clear-button" tabindex="-1" ?hidden=${this.hasSameValueAs(this.defaultValue)} @click=${() => this._onClearValue()}>
                    ${clearIcon}
                </div>
            
                <input id="input"
                    @input=${() => this._onInput()}
                    @blur=${() => this._onBlur()}
                    @keydown=${(e: KeyboardEvent) => this._onKeyDown(e)}
                    .value=${this._formatValue(this.value)}
                    ?disabled=${this.disabled}
                    ?readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .inputMode=${this._computeInputMode()}
                    placeholder=${this.placeholder ? this.placeholder : ''}
                    type="text">
            </div>
        `;
    }
}