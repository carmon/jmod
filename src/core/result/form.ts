import { createForm, createInput } from '../../dom.core.js';
import { generateValueView } from './views/value.js';
import type { FormValue } from '../edit/views/value.js';

interface CoreProps {
  json: string;
  submitValue: (value: string) => void;
}

type TargetObject<T> = T | Record<string, T>;
type TargetObjectType = TargetObject<Record<string, string | boolean | number>>;

const deepMerge = (source: Record<string, any>, target: Record<string, any>)  => {
  return void Object.keys(target).forEach(key => {
    source[key] instanceof Object && target[key] instanceof Object
      ? source[key] instanceof Array && target[key] instanceof Array
        ? void (source[key] = Array.from(new Set(source[key].concat(target[key]))))
        : !(source[key] instanceof Array) && !(target[key] instanceof Array)
          ? void deepMerge(source[key], target[key])
          : void (source[key] = target[key])
      : void (source[key] = target[key]);
  }) || source;
}

export default ({
  json,
  submitValue,
}: CoreProps): HTMLFormElement => {
  const jsonObj: Record<string, unknown> = JSON.parse(json);
  const isArray = Array.isArray(jsonObj); 
  const form = createForm({ 
    onSubmit: e => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { elements } = e.target as any;
      const obj: TargetObjectType = {};
      for (let i = 0; i < elements.length-1; ++i) {
        const { id, type }: { id: string, type: string } = elements[i];
        const getValue = () => {
          if (type === 'text') {
            return elements[i].value;
          } else if (type === 'checkbox') {
            return elements[i].checked;
          } else if (type === 'number') {
            return Number(elements[i].value);
          }
        };
        
        if (id.includes('-')) {
          const levels = id.split('-');
          let valueObj: TargetObjectType = { [levels.pop()]: getValue() }; // 0 -> valor
          while (levels.length - 1) { 
            valueObj = { [levels.pop()]: valueObj } as TargetObjectType;
          }
          const root = levels.pop();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any)[root] = deepMerge((obj as any)[root] || {}, valueObj);
        } else {
          obj[id] = getValue();
        }
      }
      console.log(obj);
      submitValue(JSON.stringify(obj, null, 2));
    } 
  });

  // Create form result ///////////////////////////////////////////////////////////////////
  const keys = isArray ? jsonObj as unknown as string[] : Object.keys(jsonObj);
  keys.forEach((k: string, i: number) => {
    form.appendChild(
      generateValueView({
        id: isArray ? i.toString() : k,
        key: isArray ? i.toString() : k,
        lineBreak: true,
        value: (isArray ? jsonObj[i] : jsonObj[k]) as FormValue,
      })
    );
  });

  form.appendChild(
    createInput({
      id: 'submit-form',
      type: 'submit',
      value: 'Submit JSON',
    })
  );
  /////////////////////////////////////////////////////////////////////////////////////////

  return form;
}