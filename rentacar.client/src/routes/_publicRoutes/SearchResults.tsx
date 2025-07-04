/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Search, { SearchFilter } from "../../components/search/Search";
import { useFetchSearchResultVehiclesQuery } from "../../api/vehicles/vehicles";
import { Card, Col, Row } from "antd";
import { Transmission, VehicleType } from "../../api/api";
import { UserOutlined } from "@ant-design/icons";
import { formatDateTime } from "../../helpers/FormatHelper";
import { useCallback, useMemo, useState } from "react";
import { useFetchLocationByIdQuery } from "../../api/locations/locations";

export const Route = createFileRoute("/_publicRoutes/SearchResults")({
    component: SearchResults,
});

function SearchResults() {
    const [searchOpen, setSearchOpen] = useState<boolean>(false);

    const search: SearchFilter = Route.useSearch();
    const navigate = useNavigate();

    const pickupDate = useMemo(() => {
        return new Date(search.pickupDate as any);
    }, [search.pickupDate]);
    const dropOffDate = useMemo(() => {
        return new Date(search.dropOffDate as any);
    }, [search.dropOffDate]);
    const pickupLocationId = search.pickupLocationId;
    const returnLocationId = search.returnLocationId;

    const { data: results } = useFetchSearchResultVehiclesQuery(
        pickupLocationId,
        pickupDate,
        dropOffDate
    );

    const { data: pickupLocation } =
        useFetchLocationByIdQuery(pickupLocationId);
    const { data: returnLocation } =
        useFetchLocationByIdQuery(returnLocationId);

    // #region Callbacks

    const handleOpenSearch = useCallback(() => {
        setSearchOpen(true);
    }, []);

    const handleChooseVehicle = useCallback(
        (vehicleId: number) => {
            navigate({
                to: "/ExtraServices",
                search: {
                    pickupLocationId: pickupLocationId,
                    returnLocationId: returnLocationId,
                    pickupDate: pickupDate,
                    dropOffDate: dropOffDate,
                    vehicleId,
                },
            });
        },
        [dropOffDate, navigate, pickupDate, pickupLocationId, returnLocationId]
    );

    // #endregion

    return (
        <>
            <div style={{ marginTop: 50 }}>
                <Row justify="center">
                    <Col span={20}>
                        {searchOpen ? (
                            <Search
                                resultSearch
                                onClose={() => setSearchOpen(false)}
                                searchFilter={{
                                    pickupLocationId,
                                    returnLocationId,
                                    pickupDate,
                                    dropOffDate,
                                }}
                            />
                        ) : (
                            <div
                                onClick={handleOpenSearch}
                                style={{
                                    display: "inline-block",
                                    padding: "12px 16px",
                                    marginBottom: 20,
                                    backgroundColor: "#ffffff",
                                    borderRadius: 12,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    fontFamily:
                                        "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        color: "#333333",
                                        margin: 10,
                                        fontSize: "1rem",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {pickupLocation?.name}
                                    {" -> "}
                                    {returnLocation?.name}
                                </div>
                                <div
                                    style={{
                                        color: "#666666",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {formatDateTime(pickupDate)}
                                    {"-"}
                                    {formatDateTime(dropOffDate)}
                                </div>
                            </div>
                        )}
                        <Row gutter={[24, 24]}>
                            {results?.map((vehicle, index) => (
                                <Col key={index} span={8}>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            boxShadow:
                                                "0 8px 24px rgba(0, 0, 0, 0.08)",
                                            border: "none",
                                            background: "lightgrey",
                                            padding: "10px",
                                        }}
                                        title={
                                            <div>
                                                <b>
                                                    {vehicle.model?.brandName}{" "}
                                                    {vehicle.model?.modelName}
                                                </b>
                                                <br />
                                                {<UserOutlined />}
                                                {vehicle.seats}{" "}
                                                {
                                                    VehicleType[
                                                        vehicle.vehicleType
                                                    ]
                                                }{" "}
                                                {
                                                    Transmission[
                                                        vehicle.transmission
                                                    ]
                                                }
                                            </div>
                                        }
                                        cover={
                                            <img
                                                src={`https://localhost:7159/${vehicle.model?.image}`}
                                                style={{
                                                    height: "250px",
                                                    width: "100%",
                                                    objectFit: "cover",
                                                    padding: 20,
                                                }}
                                            />
                                        }
                                        onClick={() =>
                                            handleChooseVehicle(vehicle.id)
                                        }
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <h3>€{vehicle.price}/day</h3>
                                            <p style={{ marginLeft: 8 }}>
                                                €
                                                {vehicle.price *
                                                    Math.ceil(
                                                        (dropOffDate.getTime() -
                                                            pickupDate.getTime()) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24) +
                                                            1
                                                    )}{" "}
                                                total
                                            </p>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default SearchResults;
