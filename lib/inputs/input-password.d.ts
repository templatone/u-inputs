import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
export declare type InputPasswordValue = string;
export declare class InputPasswordElement extends InputElement<InputPasswordValue> implements ITextBasedInputElement<InputPasswordValue> {
    readonly emptyValue: InputPasswordValue;
    defaultValue: InputPasswordValue;
    private _value;
    get value(): InputPasswordValue;
    set value(v: InputPasswordValue);
    placeholder: string | null;
    disabled: boolean;
    readOnly: boolean;
    autocomplete: AutocompleteType;
    inputMode: InputModeType;
    name: string;
    private _input;
    private _passwordVisibilityToggle;
    private _onInput;
    private _passwordVisibilityOn;
    private _passwordVisibilityOff;
    private _onPasswordVisibilityOn;
    private _onPasswordVisibilityOff;
    private _updateValue;
    private _reflectValueToView;
    clearValue(): void;
    hasSameValueAs(value: InputPasswordValue): boolean;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResultGroup;
}
