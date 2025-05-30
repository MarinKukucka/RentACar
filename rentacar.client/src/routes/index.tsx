/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from "@ant-design/icons";
import { createFileRoute } from "@tanstack/react-router";
import {
    Button,
    Card,
    Carousel,
    Col,
    DatePicker,
    Form,
    Input,
    Layout,
    Row,
} from "antd";
import { useFetchSimpleVehiclesQuery } from "../api/vehicles/vehicles";
import { useFetchLocations } from "../api/locations/locations";

export const Route = createFileRoute("/")({
    component: MainPage,
});

const { Content, Footer } = Layout;
const { RangePicker } = DatePicker;

function MainPage() {
    const { data: simpleVehicles } = useFetchSimpleVehiclesQuery();
    const { data: locations } = useFetchLocations();

    const onFinish = (values: any) => {
        console.log("Search parameters:", values);
    };

    return (
        <Layout>
            <Content style={{ padding: "100px 50px 50px" }}>
                <Card style={{ marginBottom: "50px" }}>
                    <Form
                        layout="inline"
                        onFinish={onFinish}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        <Form.Item
                            name="location"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input pickup location!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Pickup Location"
                                prefix={<SearchOutlined />}
                                style={{ width: 200 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="dates"
                            rules={[
                                { required: true, message: "Select dates!" },
                            ]}
                        >
                            <RangePicker />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Carousel autoplay style={{ marginBottom: "50px" }}>
                    {simpleVehicles?.map((vehicle) => (
                        <div key={vehicle.id}>
                            <img
                                src={`${"https://localhost:7159"}/${vehicle.image}`}
                                alt={vehicle.name}
                                style={{
                                    width: "100%",
                                    height: "400px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h2
                                style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    left: "50px",
                                    color: "#fff",
                                }}
                            >
                                {vehicle.name}
                            </h2>
                        </div>
                    ))}
                </Carousel>

                <h2 style={{ marginBottom: "20px" }}>Our Locations</h2>
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
            </Content>

            <Footer style={{ textAlign: "center" }}>
                Rent A Car ©2025 Created by Marin Kukučka
            </Footer>
        </Layout>
    );
}
