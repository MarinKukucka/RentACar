import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";
import { Card, Col, Row } from "antd";
import { useFetchLocations } from "../../api/locations/locations";

function LocationsShow() {
    const { t } = useTranslation();

    const { data: locations } = useFetchLocations();

    return (
        <>
            <h2 style={{ marginBottom: "20px" }}>
                {t(translations.locations.ourLocations)}
            </h2>
            <Row gutter={[16, 16]}>
                {locations?.map((location) => (
                    <Col key={location.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    src={`${"https://localhost:7159"}/${location.image}`}
                                    alt={location.name}
                                    style={{ padding: 10 }}
                                    height="250px"
                                />
                            }
                        >
                            <b>{location.name}</b>
                            <p>{location.address}</p>
                            <p>{location.phoneNumber}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default LocationsShow;
