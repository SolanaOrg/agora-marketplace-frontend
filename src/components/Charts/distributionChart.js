import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

import commonService from '../../config/services/common.service';
import { MARKETPLACES_API } from '../../config';


const DistributeChart = ({ symbol }) => {
  const [distributeLists, setDistributeLists] = useState({
    count: [],
    percent: []
  })

  const chartDataField = {
    series: [
      {
        // name: '#of Listings',
        type: 'bar',
        data: distributeLists?.count.map((chart) => {
          return chart;
        })
      }
    ],
    options: {
      chart: {
        width: '100% !important',
        height: 350,
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            customIcons: []
          },
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value',
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString()
              }
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            }
          },
          autoSelected: 'zoom'
        },
      },
      colors: ['#50faf0'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: "light",
          // shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 100]
        }
      },
      stroke: {
        width: 2.5,
        // curve: 'smooth'
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: [
        {
          labels: {
            align: 'left',
            style: {
              colors: "white"
            }
          },
          // title: {
          //   text: `Floor Price(SOL)`,
          //   style: {
          //     color: "#B4B4B4",
          //     fontSize: `14px`
          //   }
          // },

          formatter: function (y) {
            return y.toFixed(0);
          },
          // min: yaxisFloor.min,
          // max: yaxisFloor.max,
          tickAmount: 4
        },

      ],
      xaxis: {
        type: 'category',
        categories: distributeLists?.percent.map((item) => item),
        labels: {
          rotate: 45,
          rotateAlways: true,
          style: {
            fontSize: `14px`,
            textTransform: `rotate(45deg)`,
            fontWeight: 700,
            cssClass: 'apexcharts-xaxis-custom',
            color: 'white'
          }
        },
        group: {
          style: {
            colors: [`white`]
          }
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        markers: {
          width: 8,
          height: 8,
          radius: 24
        },
        onItemHover: {
          highlightDataSeries: false
        },
        labels: {
          colors: ['red', 'yellow']
        }
      },
      tooltip: {
        theme: false
      },
      responsive: [{
        breakpoint: 540,
        options: {
          yaxis: {
            show: false
          }
        }
      }],
    },
  }

  useEffect(() => {
    (
      async () => {
        try {
          const get_distribute = await commonService({
            method: `get`,
            route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${symbol}/list_distribution`
          })

          let count_array = [], percent_array = []
          for (let i = 0; i < get_distribute.length; i++) {
            count_array.push(get_distribute[i].count)
            const startPercent = get_distribute[i].startPercent === 0 ? '<' : get_distribute[i].startPercent
            const line = get_distribute[i].startPercent === 0 ? '' : '-'

            percent_array.push(startPercent + line + get_distribute[i].endPercent + '%')
          }
          setDistributeLists({
            ...distributeLists,
            count: count_array,
            percent: percent_array
          })
        } catch (error) {
          console.log('error', error)
        }
      }
    )()
  }, [])
  return (
    <ReactApexChart
      options={chartDataField.options}
      series={chartDataField.series}
      type="area"
      width={`100%`}
      height={330}
    />
  );

}

export default DistributeChart;