import Select, { SelectProps } from "antd/es/select";

type PositionTypeDropdownProps = SelectProps

const PositionTypeDropdown = (props: PositionTypeDropdownProps) => {
    return (
        <Select
            {...props}
            options={[
                { value: 'Main', label: 'Main' },
                { value: 'Acting', label: 'Acting' }
            ]}
            defaultValue={'Main'}
        />
    );
};

export default PositionTypeDropdown;
