import './DropdownList.css';
import React, { useState } from 'react';
import FishKindAry, {FishKind} from "./FishKind";



const  FishDropdownList: React.FC = () => {

    const [selectedOption, setSelectedOption] = useState<FishKind | null>(null);
    const [isArrowActive, setArrowActive] = useState(false);
  
    const handleSelectOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const selected = FishKindAry.find((option) => option.value === Number(selectedValue));
        setSelectedOption(selected || null);
    };

    const arrowClassName = `select-arrow ${isArrowActive ? 'active' : ''}`;

    return (
        <div className="container">
          <h2>魚種</h2>
          <div className="select-container">
            <select
              value={selectedOption?.value || ''}
              onChange={handleSelectOption}
              onFocus={() => setArrowActive(true)}
              onBlur={() => setArrowActive(false)}
            >
              <option value="">魚種を選択してください</option>
              {FishKindAry.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className={arrowClassName}></div>
          </div>
        </div>
    );
}

export default FishDropdownList;
