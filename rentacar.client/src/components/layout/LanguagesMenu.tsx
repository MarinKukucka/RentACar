import { CopyOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import languages from "../../config/localization/languages";

const { Link } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function LanguagesMenu() {
    const { i18n } = useTranslation();

    const items: MenuItem[] = [
        {
            key: "set-en-US",
            icon: <CopyOutlined />,
            label: (
                <Link
                    onClick={() => {
                        i18n.changeLanguage(languages.en);
                    }}
                >
                    {languages.en}
                </Link>
            ),
        },
        {
            key: "set-hr-HR",
            icon: <CopyOutlined />,
            label: (
                <Link
                    onClick={() => {
                        i18n.changeLanguage(languages.hr);
                    }}
                >
                    {languages.hr}
                </Link>
            ),
        },
    ];

    return <Menu items={items} />;
}

export default LanguagesMenu;
