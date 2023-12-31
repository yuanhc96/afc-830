const define = {
	result: {
		states: {
			finishActivity: {
				currentState: "1",
				extendAttribute: {
					activityDefID: "finishActivity",
					processDefId: 951,
				},
				height: 32,
				id: "finishActivity",
				isStart: false,
				name: "结束",
				type: "finish",
				width: 32,
				x: 670,
				y: 70,
			},
			manualActivity: {
				currentState: "1",
				extendAttribute: {
					activityDefID: "manualActivity",
					processDefId: 951,
				},
				height: 45,
				id: "manualActivity",
				isStart: false,
				name: "人工活动",
				type: "manual",
				width: 64,
				x: 170,
				y: 70,
			},
			manualActivity1: {
				currentState: "1",
				extendAttribute: {
					activityDefID: "manualActivity1",
					processDefId: 951,
				},
				height: 45,
				id: "manualActivity1",
				isStart: false,
				name: "超时时间设置",
				type: "manual",
				width: 64,
				x: 290,
				y: 80,
			},
			manualActivity2: {
				currentState: "1",
				extendAttribute: {
					activityDefID: "manualActivity2",
					processDefId: 951,
				},
				height: 45,
				id: "manualActivity2",
				isStart: false,
				name: "多工作项",
				type: "manual",
				width: 64,
				x: 440,
				y: 80,
			},
			startActivity: {
				currentState: "1",
				extendAttribute: {
					activityDefID: "startActivity",
					processDefId: 951,
				},
				height: 32,
				id: "startActivity",
				isStart: true,
				name: "开始",
				type: "start",
				width: 32,
				x: 60,
				y: 66,
			},
		},
		transCtrlBeans: [],
		transaction: [
			{
				name: "",
				extendAttribute: {},
				from: "startActivity",
				to: "manualActivity",
			},
			{
				name: "",
				extendAttribute: {},
				from: "manualActivity",
				to: "manualActivity1",
			},
			{
				name: "",
				extendAttribute: {},
				from: "manualActivity1",
				to: "manualActivity2",
			},
			{
				name: "",
				extendAttribute: {},
				from: "manualActivity2",
				to: "finishActivity",
			},
		],
	},
};
