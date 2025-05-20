import { VehicleDto } from "../../api/api";

interface Props {
    vehicles?: VehicleDto;
    onClose: () => void;
    onSuccess: () => void;
}

function VehiclesForm({ person, onClose, onSuccess }: Props) {
    return <>Vehicles form</>;
}

export default VehiclesForm;
