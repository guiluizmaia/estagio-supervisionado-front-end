import React from 'react';
import './style.css';

// eslint-disable-next-line @typescript-eslint/ban-types
function objectValues<T extends {}>(obj: T) {
  return Object.keys(obj).map((objKey) => obj[objKey as keyof T]);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function objectKeys<T extends {}>(obj: T) {
  return Object.keys(obj).map((objKey) => objKey as keyof T);
}

type PrimitiveType = string | symbol | number | boolean;

// Type guard for the primitive types which will support printing
// out of the box
function isPrimitive(value: any): value is PrimitiveType {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol'
  );
}

/** Component */

interface MinTableItem {
  id: PrimitiveType;
}

type TableHeaders<T extends MinTableItem> = Record<keyof T, string>;

type CustomRenderers<T extends MinTableItem> = Partial<
  Record<keyof T, (it: T) => React.ReactNode>
>;

interface TableProps<T extends MinTableItem> {
  items: T[];
  headers: TableHeaders<T>;
  customRenderers?: CustomRenderers<T>;
  action?: (id: string) => void;
  highlightLastRow?: boolean;
}

export default function Table<T extends MinTableItem>(props: TableProps<T>) {
  function renderRow(item: T, highlight?: boolean) {
    return (
      <tr
        onClick={() => props.action && props.action(item.id.toString())}
        className={`${!props.action ? '' : 'clickable-row'} ${
          highlight ? 'hl-row' : ''
        }`}
      >
        {objectKeys(item).map((itemProperty, index) => {
          if (index === 0) return null;
          const customRenderer = props.customRenderers?.[itemProperty];

          if (customRenderer) {
            return <td key={index}>{customRenderer(item)}</td>;
          }

          return (
            <td key={index}>
              <>{isPrimitive(item[itemProperty]) ? item[itemProperty] : ''}</>
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <table className='my-table'>
      <thead>
        <tr>
          {objectValues(props.headers).map(
            (headerValue, index) =>
              index > 0 && <th key={index}>{headerValue}</th>,
          )}
        </tr>
      </thead>
      <tbody>
        {props.items.map((item, index, { length }) =>
          renderRow(item, props.highlightLastRow && index === length - 1),
        )}
      </tbody>
    </table>
  );
}
