
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
            type: 'cross'
          },
          backgroundColor: 'rgba(10, 10, 41, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textStyle: {
            color: '#fff'
          },
          formatter: function(params) {
            const validPoints = params.filter(param => param.value !== null && param.value !== undefined);
            if (validPoints.length === 0) return '';
            
            let result = `<div style="margin: 0 0 5px 0; font-weight: bold;">${validPoints[0].axisValue}</div>`;
            
            validPoints.forEach(param => {
              result += `<div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                <span style="margin-right: 5px;">${param.seriesName}:</span>
                <span style="font-weight: bold;">${param.value === null ? '-' : `Rank #${param.value}`}</span>
              </div>`;
            });
            
            return result;
          }
        },
        grid: {
          left: 70,
          right: 120,
          top: 90,
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
          inverse: true,
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
          // Determine when to show end labels for specific languages
          let shouldShowEndLabel = true;
          
          // TypeScript only appears from 2019 (index 5) onwards
          if (item.name === 'TypeScript') {
            // Only show TypeScript label when animation is finished
            shouldShowEndLabel = animationFinished;
          } 
          // Go only appears in 2023 (index 9) onwards
          else if (item.name === 'Go') {
            // Only show Go label when animation is finished
            shouldShowEndLabel = animationFinished;
          }
          // Always show labels for Ruby and Obj-C even though they disappear
          else if (item.name === 'Ruby' || item.name === 'Obj-C') {
            shouldShowEndLabel = true;
          }
          
          return {
            name: item.name,
            type: 'line',
            symbol: 'circle',
            symbolSize: 10,
            sampling: 'average',
            itemStyle: {
              color: item.color
            },
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
        animationDuration: 5000,
        animationEasing: 'cubicInOut',
        animationDelay: (idx: number) => idx * 300,
        animationDurationUpdate: 300,
        animationEasingUpdate: 'linear'
      };

      chartInstance.current.setOption(option);
      
      // Set animation finished flag after the animation completes
      setTimeout(() => {
        setAnimationFinished(true);
        // Update the chart with the new endLabel settings
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
      }, 6000); // Wait a bit longer than animationDuration to ensure animation is complete
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
