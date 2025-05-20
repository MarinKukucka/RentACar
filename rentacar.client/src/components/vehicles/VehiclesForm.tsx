import { VehicleDto } from "../../api/api";

interface Props {
    vehicle?: VehicleDto;
    onClose: () => void;
    onSuccess: () => void;
}

function VehiclesForm({ vehicle, onClose, onSuccess }: Props) {
    return <>Vehicles form</>;
}

export default VehiclesForm;
