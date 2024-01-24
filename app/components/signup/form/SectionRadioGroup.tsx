import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import sections from "~/components/signup/form/sections";

interface SectionRadioGroupProps extends React.ComponentProps<typeof RadioGroup>{
  defaultValue?: number;
  setSection: React.Dispatch<React.SetStateAction<number>>;
}
export default function SectionRadioGroup({ ...props }: SectionRadioGroupProps) {
  // Props
  const { defaultValue, setSection, ...others } = props;
  // States
  const [selected, setSelected] = useState<number>(props.defaultValue ? props.defaultValue : sections[0].value);
  // Callbacks
  const onChange = (d: number) => {
    setSelected(d);
    setSection(d);
  }
  
  return (
    <RadioGroup value={ selected } onChange={ onChange } { ...others }>
      <div className={ "space-y-2" }>
        { sections.map((section) => 
        <RadioGroup.Option
          key={ section.name }
          value={ section.value }
          className={({ active, checked }) =>
            `
            border-solid border-2 rounded-lg min-h-20
            ${ active ? "border-button" : "border-gray-300" }
            ${ checked ? "border-button" : "bg-white" }
            relative flex cursor-pointer rounded-lg px-5 py-4 focus:outline-none
            `
          }
        >
          {({ active, checked }) => 
          <>
            <div className={ "flex w-full items-center justify-between" }>
              <div className={ "flex items-center" }>
                <div className={ "text-sm" }>
                  <RadioGroup.Label
                    as={ "p" }
                    className={ `text-20ptr ${ checked ? "text-button font-semibold" : "text-gray-500"}` }
                  >
                    { section.name }
                  </RadioGroup.Label>
                </div>
              </div>
              { checked && 
              <div className={ "shrink-0 text-white" }>
                <CheckIcon className={ "w-8 h-8" } />
              </div>
              }
            </div>
          </>
          }
        </RadioGroup.Option>
        ) }
      </div>
    </RadioGroup>
  )
}

const CheckIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox={ "0 0 24 24" } fill={ "none" } { ...props }>
    <circle cx={ 12 } cy={ 12 } r={ 12 } fill={ "#000" } opacity={ "0.2" } />
    <path
      d={ "M7 13l3 3 7-7" }
      stroke={ "#000" }
      strokeWidth={ 1.5 }
      strokeLinecap={ "round" }
      strokeLinejoin={ "round" }
    />
  </svg>
);