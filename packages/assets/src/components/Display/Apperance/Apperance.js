import NotifiPosition from "../../NotifiPosition";
import Timing from "../Timing/Timing";
import CheckboxComponent from '@assets/components/Display/Apperance/ChecboxComponent/CheckboxComponent';

const Appearance = ({ defaultOptions, handleSelectPositon, data, handleCheckbox }) => {
  return (
    <div>
      Appearance
      <NotifiPosition
        defaultOptions={defaultOptions}
        handleSelectPositon={handleSelectPositon}
        data={data}
      />
      <CheckboxComponent handleCheckbox={handleCheckbox} data={data} />
    </div>
  );
}

export default Appearance;
