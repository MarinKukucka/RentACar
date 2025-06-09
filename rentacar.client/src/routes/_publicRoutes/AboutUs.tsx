import { createFileRoute } from "@tanstack/react-router";
import { Typography, Row, Col, Card } from "antd";

const { Title, Paragraph } = Typography;

export const Route = createFileRoute("/_publicRoutes/AboutUs")({
    component: AboutUs,
});

function AboutUs() {
    return (
        <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
            <Typography>
                <Title level={2}>About Us</Title>
                <Title level={4}>
                    Welcome to{" "}
                    <span style={{ color: "#1890ff" }}>CARcarAPP</span> – Your
                    Journey Starts Here
                </Title>
                <Paragraph>
                    At <strong>CARcarAPP</strong>, we're redefining the way you
                    rent vehicles. Whether you're planning a weekend getaway,
                    need a car for a business trip, or just want a ride across
                    town, our mission is simple:
                    <em> make car rental fast, affordable, and stress-free.</em>
                </Paragraph>

                <Title level={4}>Who We Are</Title>
                <Paragraph>
                    CARcarAPP was born out of a passion for smart mobility and
                    user-friendly technology. We're a team of car enthusiasts,
                    tech developers, and travel lovers who believe that renting
                    a car should be as easy as ordering a coffee. No more
                    paperwork, no more hidden fees – just the car you need, when
                    you need it.
                </Paragraph>

                <Title level={4}>What We Offer</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Card title="Wide Selection" bordered={false}>
                            From budget-friendly hatchbacks to luxury sedans and
                            SUVs – we’ve got the perfect ride for every
                            occasion.
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card title="Real-Time Booking" bordered={false}>
                            Find, book, and unlock your vehicle – all in a few
                            taps.
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card title="Transparent Pricing" bordered={false}>
                            What you see is what you pay. No surprises.
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card title="24/7 Support" bordered={false}>
                            Our team is here for you whenever you need help, day
                            or night.
                        </Card>
                    </Col>
                    <Col xs={24}>
                        <Card title="Local & Reliable" bordered={false}>
                            We work with trusted rental partners and local
                            fleets to ensure top-notch service and vehicle
                            quality.
                        </Card>
                    </Col>
                </Row>

                <Title level={4}>Why Choose CARcarAPP?</Title>
                <Paragraph>
                    Because we built it with <strong>you</strong> in mind. Our
                    intuitive app is designed to make your car rental experience
                    smooth, secure, and satisfying – every time.
                </Paragraph>
            </Typography>
        </div>
    );
}

export default AboutUs;
