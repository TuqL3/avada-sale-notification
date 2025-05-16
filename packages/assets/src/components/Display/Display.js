import Appearance from "./Apperance/Apperance";
import Timing from "./Timing/Timing";

const Display = ({ defaultOptions, handleSelectPositon, data, handleCheckbox }) => {
  return (
    <div>
      <Appearance
        defaultOptions={defaultOptions}
        handleSelectPositon={handleSelectPositon}
        data={data}
        handleCheckbox={handleCheckbox}
      />
      <Timing handleCheckbox={handleCheckbox} data={data} />
    </div>
  );
}

export default Display;
