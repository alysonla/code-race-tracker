import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { githubLanguageData, yearLabels } from '@/data/githubLanguageData';
import { cn } from '@/lib/utils';

const GitHubLanguageRace: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);

    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas'
      });
      
      const option: echarts.EChartsOption = {
        title: {
          text: 'Top programming languages on GitHub',
          subtext: 'RANKED BY COUNT OF DISTINCT USERS CONTRIBUTING TO PROJECTS OF EACH LANGUAGE.',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          },
          subtextStyle: {
            color: '#aaa',
            fontSize: 14,
            fontFamily: 'monospace'
          }
        },
        backgroundColor: '#0A0A29',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
      type: 'cross',
      snap: true,
      label: {
      show: false
      }
    },
  backgroundColor: 'rgba(10, 10, 41, 0.9)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  textStyle: {
    color: '#fff'
  },
  formatter: function (params) {
    // Filter out null values.
    const validPoints = params.filter(p => p.value !== null && p.value !== undefined);
    if (validPoints.length === 0) return '';
    
    // Sort them by their value. 
    // For example, ascending by rank:
    validPoints.sort((a, b) => (a.value as number) - (b.value as number));
    // If you want the reverse, do (b.value - a.value).

    let result = `<div style="margin: 0 0 5px 0; font-weight: bold;">${validPoints[0].axisValue}</div>`;
    
    validPoints.forEach((p) => {
      result += `
        <div style="display: flex; align-items: center; margin: 3px 0;">
          <span style="
            display: inline-block; 
            width: 10px; 
            height: 10px; 
            background-color: ${p.color}; 
            border-radius: 50%; 
            margin-right: 5px;
          "></span>
          <span style="margin-right: 5px;">${p.seriesName}:</span>
          <span style="font-weight: bold;">Rank #${p.value}</span>
        </div>
      `;
    });
    
    return result;
  }
},

        grid: {
          left: 70,
          right: 120,
          top: 120,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          data: yearLabels,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        
        yAxis: {
          type: 'value',
          min: 1,
          max: 10,
          interval: 1,
          inverse: true,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          axisPointer: {
            show: true,
            snap: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 14,
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: githubLanguageData.map(item => {
          let shouldShowEndLabel = true;
          
          if (item.name === 'TypeScript') {
            shouldShowEndLabel = animationFinished;
          } 
          else if (item.name === 'Go') {
            shouldShowEndLabel = animationFinished;
          }
          else if (item.name === 'Ruby' || item.name === 'Obj-C') {
            shouldShowEndLabel = true;
          }
          
          return {
            name: item.name,
            type: 'line',
            // Put a symbol on every data point
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
  // Important: turn on clipping so the line
  // and markers only appear as the line is drawn
            clip: true,
  // Example line and item style
            lineStyle: { width: 4, color: item.color },
            itemStyle: { color: item.color },
            // data: item.values
            // name: item.name,
            // type: 'line',
            // symbol: 'circle',
            // symbolSize: 10,
            // sampling: 'average',
            // itemStyle: {
            //   color: item.color
            // },
            lineStyle: {
              width: 4,
              color: item.color,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 5
            },
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 6
              },
              itemStyle: {
                borderWidth: 3
              }
            },
            data: item.values,
            endLabel: {
              show: shouldShowEndLabel,
              formatter: (params) => {
                return item.name;
              },
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold',
              backgroundColor: item.color,
              padding: [5, 8],
              borderRadius: 3
            },
            z: 10 - Math.min(...item.values.filter(v => v !== null))
          };
        }),
        animationDuration: 8000,
        animationEasing: 'cubicInOut',
        animationDelay: (idx: number) => idx * 500,
        animationDurationUpdate: 500,
        animationEasingUpdate: 'linear'
      };

      chartInstance.current.setOption(option);
      
      setTimeout(() => {
        setAnimationFinished(true);
        if (chartInstance.current) {
          chartInstance.current.setOption({
            series: githubLanguageData.map(item => ({
              name: item.name,
              endLabel: {
                show: true
              }
            }))
          });
        }
      }, 7600);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [animationFinished]);

  return (
    <div className="w-full h-full bg-[#0A0A29] rounded-lg shadow-xl overflow-hidden border border-white/10">
      <div className="p-4 sm:p-0">
        <div 
          ref={chartRef} 
          className={cn(
            "w-full", 
            "h-[500px] sm:h-[600px] md:h-[700px]",
            "touch-auto"
          )} 
          aria-label="GitHub programming languages popularity trend from 2014 to 2024"
          role="img"
        />
      </div>
    </div>
  );
};

export default GitHubLanguageRace;
