/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

const { RangePicker } = DatePicker;

function Search() {
    const { t } = useTranslation();

    const onFinish = (values: any) => {
        console.log("Search parameters:", values);
    };

    return (
        <Card style={{ marginBottom: "50px" }}>
            <Form
                layout="inline"
                onFinish={onFinish}
                style={{ width: "100%", justifyContent: "center" }}
            >
                <Form.Item
                    name="pickupLocations"
                    rules={[
                        {
                            required: true,
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
                    name="dropOffLocation"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input
                        placeholder="Drop Off Location"
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                    />
                </Form.Item>
                <Form.Item
                    name="dates"
                    rules={[{ required: true, message: "Select dates!" }]}
                >
                    <RangePicker />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t(translations.general.search)}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Search;
