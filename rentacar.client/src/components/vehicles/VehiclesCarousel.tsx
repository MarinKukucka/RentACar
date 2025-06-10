import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";
import { Card, Carousel } from "antd";
import { SimpleVehicleDto } from "../../api/api";
import { useFetchSimpleVehiclesQuery } from "../../api/vehicles/vehicles";
import "./Vehicles.css";

function VehiclesCarousel() {
    const { t } = useTranslation();
    const { data: simpleVehicles = [] } = useFetchSimpleVehiclesQuery();

    return (
        <>
            <h2 style={{ marginBottom: "20px" }}>
                {t(translations.vehicles.ourVehicles)}
            </h2>

            <Carousel
                autoplay
                infinite
                slidesToShow={4}
                slidesToScroll={1}
                className="vehicles-carousel"
                style={{ marginBottom: "50px" }}
            >
                {simpleVehicles.map((vehicle: SimpleVehicleDto) => (
                    <div key={vehicle.id} className="slide-item">
                        <Card
                            hoverable
                            cover={
                                <img
                                    src={`https://localhost:7159/${vehicle.image}`}
                                    alt={vehicle.name}
                                    className="slide-image"
                                />
                            }
                            title={vehicle.name}
                            className="slide-card"
                        />
                    </div>
                ))}
            </Carousel>
        </>
    );
}

export default VehiclesCarousel;
