import { FC, memo, useCallback, useMemo } from "react"
import { Header } from "./header"
import { ViewItemShape, ViewSetterProps } from "./interface"
import { generateNewViewItem } from "./utils/generateNewOptions"
import { ListBody } from "./listBody"
import { TabListSetterProvider } from "./context/tabListContext"
import { get } from "lodash"
import { useSelector } from "react-redux"
import { getExecutionResult } from "@/redux/currentApp/executionTree/executionSelector"
import { setterPublicWrapper, viewSetterWrapperStyle } from "./style"
import { useTranslation } from "react-i18next"

export const TabListSetter: FC<ViewSetterProps> = memo(
  (props: ViewSetterProps) => {
    const {
      value,
      handleUpdateDsl,
      attrName,
      widgetDisplayName,
      childrenSetter,
      handleUpdateMultiAttrDSL,
    } = props
    const { t } = useTranslation()
    const executionResult = useSelector(getExecutionResult)

    const allViews = useMemo(() => {
      return get(
        executionResult,
        `${widgetDisplayName}.${attrName}`,
        [],
      ) as ViewItemShape[]
    }, [attrName, executionResult, widgetDisplayName])

    const allViewsKeys = useMemo(() => {
      return allViews.map((view) => view.key)
    }, [allViews])

    const handleAddViewItem = useCallback(() => {
      const newItem = generateNewViewItem(allViewsKeys)
      handleUpdateMultiAttrDSL?.({
        [attrName]: [...value, newItem],
      })
    }, [allViewsKeys, handleUpdateMultiAttrDSL, attrName, value])

    return (
      <TabListSetterProvider
        list={value}
        childrenSetter={childrenSetter || []}
        handleUpdateDsl={handleUpdateDsl}
        widgetDisplayName={widgetDisplayName}
        attrPath={attrName}
        handleUpdateMultiAttrDSL={handleUpdateMultiAttrDSL}
      >
        <div css={setterPublicWrapper}>
          <div css={viewSetterWrapperStyle}>
            <Header
              labelName={t("editor.inspect.setter_content.tabs_setter.tabs")}
              addAction={handleAddViewItem}
              hasAddAction
            />
            <ListBody />
          </div>
        </div>
      </TabListSetterProvider>
    )
  },
)

TabListSetter.displayName = "TabListSetter"
