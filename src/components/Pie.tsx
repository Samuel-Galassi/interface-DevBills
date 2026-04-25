import type { PieLabelRenderProps } from "recharts";
import type { CategorySummary } from "../../types/category";

 type ChartLabelProps= Omit<PieLabelRenderProps, "payload"> & {

    payload: CategorySummary;
    name: string;
    percent: number;
 }

export const renderPieChartLabel = (props: PieLabelRenderProps) => {

    const { x, y, textAnchor, percent, payload, name } = props as ChartLabelProps;

    return (

      <text

        x={x}

        y={y}

        textAnchor={textAnchor}

        dominantBaseline="central"

        style={{ fontSize: "12px", fontWeight: "bold" }}

        fill={payload.categoryColor}

      >

        {`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}

      </text>

    );

  };