import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";
import { Card, Carousel, Col, Row } from "antd";
import { chunk } from "lodash";
import { SimpleVehicleDto } from "../../api/api";
import { useFetchSimpleVehiclesQuery } from "../../api/vehicles/vehicles";

function VehiclesCarousel() {
    const { t } = useTranslation();

    const { data: simpleVehicles } = useFetchSimpleVehiclesQuery();

    return (
        <>
            <h2 style={{ marginBottom: "20px" }}>
                {t(translations.vehicles.ourVehicles)}
            </h2>

            <Carousel autoplay style={{ marginBottom: "50px" }}>
                {chunk(simpleVehicles || [], 4).map(
                    (vehicleGroup: SimpleVehicleDto[], index: number) => (
                        <div key={index}>
                            <Row gutter={16} justify="center">
                                {vehicleGroup.map((vehicle) => (
                                    <Col
                                        key={vehicle.id}
                                        xs={24}
                                        sm={12}
                                        md={6}
                                    >
                                        <Card
                                            cover={
                                                <img
                                                    src={`https://localhost:7159/${vehicle.image}`}
                                                    alt={vehicle.name}
                                                    style={{
                                                        height: "250px",
                                                        objectFit: "cover",
                                                        padding: 20,
                                                    }}
                                                />
                                            }
                                            title={vehicle.name}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )
                )}
            </Carousel>
        </>
    );
}

export default VehiclesCarousel;
