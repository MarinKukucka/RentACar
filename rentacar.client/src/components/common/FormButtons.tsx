import { Button, Row } from "antd";
import translations from "../../config/localization/translations";
import { useTranslation } from "react-i18next";
import { SaveOutlined } from "@ant-design/icons";

interface Props {
    onClose: () => void;
}

function FormButtons({ onClose }: Props) {
    const { t } = useTranslation();

    return (
        <Row className="form-buttons">
            <Button type="default" onClick={onClose}>
                {t(translations.general.cancel)}
            </Button>
            <Button type="primary" htmlType="submit">
                <SaveOutlined />
                {t(translations.general.save)}
            </Button>
        </Row>
    );
}

export default FormButtons;
