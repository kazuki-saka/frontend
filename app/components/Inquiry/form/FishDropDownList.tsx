import './DropdownList.css';
import React, { useState } from 'react';
import FishKindAry, {FishKind} from "../../FishKind";
import { useField } from "remix-validated-form";


//魚種用ドロップダウンリスト
const  FishDropdownList: React.FC = () => {

    const error = useField("inquiry.kind");
    const [selectedOption, setSelectedOption] = useState<FishKind | null>(null);
    const [isArrowActive, setArrowActive] = useState(false);
  
    const handleSelectOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selected = FishKindAry.find((item) => item.value === Number(selectedValue));
        setSelectedOption(selected || null);
    };

    const arrowClassName = `select-arrow ${isArrowActive ? 'active' : ''}`;

    return (
        <div className="container-downlist">
          <h2>魚種</h2>
          <div className="select-container-downlist">
            <select
              value={selectedOption?.value || ''}              
              onChange={handleSelectOption}
              onFocus={() => setArrowActive(true)}
              onBlur={() => setArrowActive(false)}
              className={ error.error && "border-error bg-error-100 text-error" }
            >
              <option value="">魚種を選択してください</option>
              {FishKindAry.map((item) => (
                <option key={item.value} value={item.value} >
                  {item.name}
                </option>
              ))}
            </select>
            <div className={arrowClassName}></div>
          </div>
        </div>
    );
}

export default FishDropdownList;
