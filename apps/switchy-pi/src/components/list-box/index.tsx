import { useCallback } from 'react';
import { CheckIcon } from 'lucide-react';
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxProps as AriaListBoxProps,
  Collection,
  Header,
  ListBoxItemProps,
  ListBoxItemRenderProps,
  Section,
  SectionProps,
  composeRenderProps,
} from 'react-aria-components';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { composeTailwindRenderProps, focusRing } from '../shared/utils';

interface ListBoxProps<T> extends Omit<AriaListBoxProps<T>, 'layout' | 'orientation'> {}

export function ListBox<T extends object>({ children, ...props }: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'outline-0 p-1 border border-gray-300 dark:border-zinc-600 rounded-lg'
      )}
    >
      {children}
    </AriaListBox>
  );
}

export const itemStyles = tv({
  extend: focusRing,
  base: 'group relative flex items-center gap-2 my-1 cursor-default select-none py-1.5 px-2.5 rounded-md will-change-transform text-sm forced-color-adjust-none transition-colors',
  variants: {
    isSelected: {
      false: 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 -outline-offset-2',
      true: 'bg-blue-600 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none -outline-offset-4 outline-white dark:outline-white forced-colors:outline-[HighlightText]',
    },
    isDisabled: {
      true: 'text-slate-300 dark:text-zinc-600 forced-colors:text-[GrayText]',
    },
  },
});

export function ListBoxItem(props: ListBoxItemProps) {
  let textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);

  const classNameProp = useCallback(
    (values: ListBoxItemRenderProps) => clsx(itemStyles(values), props.className),
    [props.className]
  );

  return (
    <AriaListBoxItem {...props} textValue={textValue} className={classNameProp}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </AriaListBoxItem>
  );
}

export const dropdownItemStyles = tv({
  base: 'group flex items-center gap-2 cursor-default select-none my-1 first:mt-0 last:mb-0 py-2 pl-3 pr-1 rounded-lg outline outline-0 text-sm forced-color-adjust-none',
  variants: {
    isDisabled: {
      false: 'text-slate-700 dark:text-zinc-100',
      true: 'text-gray-300 dark:text-zinc-600 forced-colors:text-[GrayText]',
    },
    isFocused: {
      true: 'bg-blue-600 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]',
    },
    isSelected: {
      true: 'bg-blue-600 text-white',
    },
  },
});

export function DropdownItem(props: ListBoxItemProps) {
  let textValue = props.textValue || (typeof props.children === 'string' ? props.children : undefined);
  return (
    <AriaListBoxItem {...props} textValue={textValue} className={dropdownItemStyles}>
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex items-center flex-1 gap-2 font-normal truncate group-selected:font-semibold">
            {children}
          </span>
          <span className="flex items-center w-5">{isSelected && <CheckIcon className="w-4 h-4" />}</span>
        </>
      ))}
    </AriaListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
}

export function DropdownSection<T extends object>(props: DropdownSectionProps<T>) {
  return (
    <Section className="first:-mt-[5px] after:content-[''] after:block after:h-[5px]">
      <Header
        className={twMerge(
          'text-sm font-semibold text-gray-500 dark:text-zinc-300 px-4 py-1 truncate -mx-1 bg-gray-100/60 dark:bg-zinc-700/60 border-y dark:border-y-zinc-700 [&+*]:mt-1',
          props.className
        )}
      >
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </Section>
  );
}
