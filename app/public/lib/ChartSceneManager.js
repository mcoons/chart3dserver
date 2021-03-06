// import * as BABYLON from '../babylonjs/babylon.max.js';

import {
    Gui2DManager
} from '../lib/Gui2DManager.js';
import {
    Gui3DManager
} from '../lib/Gui3DManager.js';
import {
    remap,
    lerp,
    hexToRgb,
    calculateScale,
    map,
    getColor,
    showAxis,
    colorList,
    months
} from '../lib/utilities.js';

class ChartSceneManager {

    constructor(options) { // scene options object
        this.options = {
            // defaults
            id: null,
            type: null,
            width: 300,
            height: 200,
            cameraFirstPerson: true,
            backgroundColor: { //  <default white>
                r: 1,
                g: 1,
                b: 1
            }
        }

        Object.assign(this.options, options);

        if (this.options.id === null) {
            console.log('ERROR: Scene canvas id not defined!');
            return {
                error: 'ERROR: Scene canvas id not defined!'
            };
        }

        // if (this.options.type === null) {
        //     console.log('ERROR: Scene type not defined!');
        //     return {error: 'ERROR: Scene type not defined!'};
        // }

        // Create base scene
        this.scene = this.initializeScene();
        this.gui3D = new Gui3DManager(this.scene, this.objects, options, this);
        this.gui2D = new Gui2DManager(this);


        this.chartsList = [];

        this.hoverPanel = null;

        this.engine.runRenderLoop(() => {

            this.chartsList.forEach(chart => {
                chart.myUpdate();
            })

            this.scene.render();
        });

    }

    initializeScene() {
        this.canvas = document.getElementById(this.options.id);
        this.canvas.width = this.options.width ? this.options.width : 300;
        this.canvas.height = this.options.height ? this.options.height : 200;

        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        let scene = new BABYLON.Scene(this.engine);
        // scene.debugLayer.show();

        // let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
        // light0.intensity = .55;

        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(1500, 1500, 1500), scene);
        light1.intensity = .9;

        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-1500, -1500, -1500), scene);
        light2.intensity = .9;

        let light3 = new BABYLON.PointLight("light2", new BABYLON.Vector3(1500, 1500, -1500), scene);
        light3.intensity = .9;

        let light4 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-1500, -1500, 1500), scene);
        light4.intensity = .9;

        let camera;

        if (this.options.cameraFirstPerson) {
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, 0), scene);
            camera.setTarget(new BABYLON.Vector3(0, 0, 100));
            //camera.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            //camera.rotation = new BABYLON.Vector3(0, 0, 0);
            //camera.position = new BABYLON.Vector3(254, 150, -550);
            // camera.position = new BABYLON.Vector3(0, 0, 0);

            // if (this.options.ucCameraSpeed) camera.speed = this.options.ucCameraSpeed;
            // if (this.options.ucCameraRotX) camera.rotation.x = this.options.ucCameraRotX;
            // if (this.options.ucCameraRotY) camera.rotation.y = this.options.ucCameraRotY;
            // if (this.options.ucCameraRotZ) camera.rotation.z = this.options.ucCameraRotZ;

            // if (this.options.ucCameraPosX) camera.position.x = this.options.ucCameraPosX;
            // if (this.options.ucCameraPosY) camera.position.y = this.options.ucCameraPosY;
            // if (this.options.ucCameraPosZ) camera.position.z = this.options.ucCameraPosZ;

        } else {
            camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 600, new BABYLON.Vector3(0, 0, 0), scene);

            // camera.lowerRadiusLimit = 5;
            // camera.upperRadiusLimit = 40;
            // camera.lowerAlphaLimit = Math.PI;
            // camera.upperAlphaLimit = Math.PI * 2;
            // camera.lowerBetaLimit = 0;
            // camera.upperBetaLimit = Math.PI;
        }

        scene.activeCamera.attachControl(this.canvas);

        if (this.options.backgroundColor) {
            scene.clearColor = new BABYLON.Color3(
                this.options.backgroundColor.r,
                this.options.backgroundColor.g,
                this.options.backgroundColor.b
            );
        } else {
            scene.clearColor = new BABYLON.Color3(1, 1, 1);
        }

        return scene;
    }

    addChart(options) { //  chart options object

        let chart = null;

        switch (options.type) {
            case 'line':
                chart = new LineChart(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'bar':
                chart = new BarChart(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'stacked':
                chart = new StackedBarChart(this.scene, options, this.gui3D, this.gui2D);
                break;

            case '3D':
                chart = new BarChart3D(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'pie':
                chart = new PieChart(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'gauge':
                chart = new Gauge(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'gauge2':
                chart = new Gauge2(this.scene, options, this.gui3D, this.gui2D);
                break;

            case 'area':
                chart = new AreaChart(this.scene, options, this.gui3D, this.gui2D);
                break;


            default:
                console.log('ERROR: Invalid chart type');
                break;
        }

        if (chart != null)
            this.chartsList.push(chart);

        return chart;
    }

    updateChart(chart, options) {

        console.log('chart in update');
        console.log(chart);

        // if (options.type === chart.)
    }

    removeChart(id) {
        console.log('in removeChart');
        console.log('id:');
        console.log(id);
        console.log('this:');
        console.log(this);

        id.destroySelf();

        for (var i = 0; i < this.chartsList.length; i++) {
            if (this.chartsList[i] === id) {
                this.chartsList.splice(i, 1);
            }
        }
    }

}


class BaseChart {

    constructor(scene, options, gui3D, gui2D) {

        this.options = {
            type: null,
            title: null,
            data: null,

            titleDepth: .01, //  < default .01 >
            doughnut: false, // applies to pie chart only

            round: false, //  < default false >  applies to bar chart only        
            depth: 10.5, //  < default .25 >          
            alpha: 1, //  < default 1 >

            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            },
            transition: false
        };

        Object.assign(this.options, options);

        if (this.options.type === null) {
            console.log('ERROR: Chart type not defined!');
            return {
                error: 'ERROR: Chart type not defined!'
            };
        }

        if (this.options.title === null) {
            console.log('ERROR: Chart title not defined!');
            return {
                error: 'ERROR: Chart title not defined!'
            };
        }

        if (this.options.data === null) {
            console.log('ERROR: Chart data not defined!');
            return {
                error: 'ERROR: Chart data not defined!'
            };
        }

        this.scene = scene;
        this.options = options;
        this.data = options.data;
        this.gui3D = gui3D;
        this.gui2D = gui2D;

        this.mySlices = [];
        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        this.masterTransform = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 10
        }, this.scene);

        this.materials = [];
        this.createMaterials(this.materials);

        this.padding = 10;

        this.labelScale = 4.0;

        // Basic line/text material
        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.alpha = 1;
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        // this.lineMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

        if (this.options.textColor) {
            this.lineMat.diffuseColor = new BABYLON.Color3(this.options.textColor.r, this.options.textColor.g, this.options.textColor.b);
        } else {
            this.lineMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        }

        if (this.options.textDepth) {
            this.textDepth = this.options.textDepth;
        } else {
            this.textDepth = .01;
        }
    }

    createMaterials(materials) {
        for (let i = 0; i < colorList.length; i++) {
            let mat = new BABYLON.StandardMaterial("mat" + i, this.scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(colorList[i]);
            mat.specularColor = BABYLON.Color3.FromHexString(colorList[i]);
            // mat.specularColor = new BABYLON.Color3(mat.diffuseColor.r*1.4,mat.diffuseColor.g*1.4,mat.diffuseColor.b*1.4)
            // let tex = new BABYLON.Texture("textures/normal2.jpg", this.scene);	
            // tex.coordinatesMode = 8;
            // mat.bumpTexture = tex;


            if (this.options.alpha) {
                mat.alpha = this.options.alpha;
            } else {
                mat.alpha = 1;
            }

            materials.push(mat);
        }
        materials[0].specularColor = new BABYLON.Color3(.4, .4, .4);
    }

    updateMaterial(index, color) {
        if (index >= this.materials.length || index < 0) {
            console.log('ERROR: Material index out of range.');
        } else {
            this.materials[index].diffuseColor.r = color.r;
            this.materials[index].diffuseColor.g = color.g;
            this.materials[index].diffuseColor.b = color.b;
        }
    }

    updateMaterialGradient(startColor, endColor, startIndex, endIndex) { // 0-63

        let length = endIndex - startIndex;
        for (let index = 0; index <= length; index++) {
            let newColor = getColor(startColor, endColor, 0, length, index);

            this.materials[index + startIndex].diffuseColor.r = newColor.r;
            this.materials[index + startIndex].diffuseColor.g = newColor.g;
            this.materials[index + startIndex].diffuseColor.b = newColor.b;

        }

    }

    parseData() {
        this.seriesNames = Object.keys(this.options.data);
        this.seriesCount = this.seriesNames.length;
        this.seriesLength = this.options.data[this.seriesNames[0]].length;
        this.seriesTotals = [];

        this.highVal = Number.MIN_SAFE_INTEGER;
        this.lowVal = Number.MAX_SAFE_INTEGER;

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            this.seriesTotals[elementIndex] = 0;

            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

                if (element.value > this.highVal) this.highVal = element.value;
                if (element.value < this.lowVal) this.lowVal = element.value;

                this.seriesTotals[elementIndex] += element.value;
            }
        }

        this.seriesHighTotal = Math.max(...this.seriesTotals);
    }

    getElementsAcrossSeries(data, index) {

    }

    addActions(obj, actionOptions) {
        obj.actionManager = new BABYLON.ActionManager(this.scene);

        Object.keys(actionOptions).forEach(key => {
            obj.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager[key],
                    actionOptions[key]
                ));
        });
    }

    addScale(yPosition, label, textScale, gui3D) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -1.75, this.lineMat);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75, this.lineMat);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

        myBox.parent = this.masterTransform;
        myBox.position.x -= this.masterTransform.position.x;
        myBox.position.y -= this.masterTransform.position.y;
        myBox.position.z -= this.masterTransform.position.z;


        leftScale.getMesh().parent = this.masterTransform;
        leftScale.getMesh().position.x -= this.masterTransform.position.x;
        leftScale.getMesh().position.y -= this.masterTransform.position.y;
        leftScale.getMesh().position.z -= this.masterTransform.position.z;


        rightScale.getMesh().parent = this.masterTransform;
        rightScale.getMesh().position.x -= this.masterTransform.position.x;
        rightScale.getMesh().position.y -= this.masterTransform.position.y;
        rightScale.getMesh().position.z -= this.masterTransform.position.z;

    }

    destroySelf(chart) {
        this.mySlices.forEach(element => {
            element.dispose();
        });
        this.mySlices = [];

        this.myBars.forEach(element => {
            element.dispose();
        });
        this.myBars = [];

        this.myLabels.forEach(element => {
            element.dispose();
        });
        this.myLabels = [];

        this.myPlanes.forEach(element => {
            element.dispose();
        });
        this.myPlanes = [];

        this.myScales.forEach(element => {
            element.dispose();
        });
        this.myScales = [];

        this.myTexts.forEach(element => {
            element.dispose();
        });
        this.myTexts = [];

    }

    fadeIn() {
        BABYLON.Animation.CreateAndStartAnimation('zoomin', this.masterTransform, 'scaling', 30, 30, new BABYLON.Vector3(.0001, .0001, .0001), new BABYLON.Vector3(1, 1, 1), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('rotin', this.masterTransform, 'rotation.y', 30, 30, 0, 2 * Math.PI, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('movey', this.masterTransform, 'position.y', 30, 30, -200, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'position.z', 30, 30, -600, -1000, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    moveMe(start, end, fps, seconds) {
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'position', fps, fps * seconds, start, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    scaleMe(start, end, fps, seconds) {
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'scaling', fps, fps * seconds, start, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    rotateMeX(start, end, fps, seconds) {
        BABYLON.Animation.CreateAndStartAnimation('rotatex', this.masterTransform, 'rotation.x', fps, fps * seconds, start, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    rotateMeY(start, end, fps, seconds) {
        BABYLON.Animation.CreateAndStartAnimation('rotatey', this.masterTransform, 'rotation.y', fps, fps * seconds, start, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    rotateMeZ(start, end, fps, seconds) {
        BABYLON.Animation.CreateAndStartAnimation('rotatez', this.masterTransform, 'rotation.z', fps, fps * seconds, start, end, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    myUpdate() {
        // Placeholder for chart specific overload
    }

}


class BarChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        // parse the data for min,max,total, etc
        this.parseData();

        // calculate scale max and interval
        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = (this.elementWidth) / this.seriesCount;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        this.build(options);

        this.masterTransform.position.x = 0;
        this.masterTransform.position.y = 0;

        // console.log(this.options.data);

    }

    addBar(elementIndex, seriesIndex) {

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.depth ? this.options.depth : 10
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        bar.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];
        bar.userData.material = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                this.gui2D.advancedTexture.removeControl(this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build(barChartOptionsxx) {

        if (this.options.showBackplanes) {

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth + 400,
                height: this.planeHeight + 300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartMarginPlane.position.y = this.planeHeight / 2;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

            // Add actions to bar
            var actionsObject = {

                OnPointerOverTrigger: () => {
                    // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                    // this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
                    // console.log('mouseOver', bar);
                }

            };

            this.addActions(chartMarginPlane, actionsObject);

            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength + 1; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.padding / 2;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale, this.gui3D);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale * 2,
                -1.75,
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;

        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);

        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;


        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {

                let bar = this.addBar(elementIndex, seriesIndex);
                bar.parent = this.masterTransform;
                bar.position.x -= this.masterTransform.position.x;
                bar.position.y -= this.masterTransform.position.y;
                bar.position.z -= this.masterTransform.position.z;

            }
        }
    }

    myUpdate() {
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }

    addChartAPI(url, labelField, valueField) {
        console.log('Adding API info: ', url, labelField, valueField);

    }

    getAPIData(url, labelField, valueField) {
        console.log('Fetching from: ', url);
        console.log('Plotting field ' + labelField + ' with data from ' + valueField);
    }

    myUpdate() {
        // Placeholder for chart specific overload
        if (!this.options.data) {
            if (!this.options.apiInfo) {
                console.log('ERROR: "data" or "API info" must be defined');
            } else {
                console.log('Fetching API data');
                this.options.data = {
                    "rovers": [{
                        "id": 5,
                        "name": "Curiosity",
                        "landing_date": "2012-08-06",
                        "launch_date": "2011-11-26",
                        "status": "active",
                        "max_sol": 2422,
                        "max_date": "2019-05-30",
                        "total_photos": 352391,
                        "cameras": [{
                            "name": "FHAZ",
                            "full_name": "Front Hazard Avoidance Camera"
                        }, {
                            "name": "NAVCAM",
                            "full_name": "Navigation Camera"
                        }, {
                            "name": "MAST",
                            "full_name": "Mast Camera"
                        }, {
                            "name": "CHEMCAM",
                            "full_name": "Chemistry and Camera Complex"
                        }, {
                            "name": "MAHLI",
                            "full_name": "Mars Hand Lens Imager"
                        }, {
                            "name": "MARDI",
                            "full_name": "Mars Descent Imager"
                        }, {
                            "name": "RHAZ",
                            "full_name": "Rear Hazard Avoidance Camera"
                        }]
                    }, {
                        "id": 7,
                        "name": "Spirit",
                        "landing_date": "2004-01-04",
                        "launch_date": "2003-06-10",
                        "status": "complete",
                        "max_sol": 2208,
                        "max_date": "2010-03-21",
                        "total_photos": 124550,
                        "cameras": [{
                            "name": "FHAZ",
                            "full_name": "Front Hazard Avoidance Camera"
                        }, {
                            "name": "NAVCAM",
                            "full_name": "Navigation Camera"
                        }, {
                            "name": "PANCAM",
                            "full_name": "Panoramic Camera"
                        }, {
                            "name": "MINITES",
                            "full_name": "Miniature Thermal Emission Spectrometer (Mini-TES)"
                        }, {
                            "name": "ENTRY",
                            "full_name": "Entry, Descent, and Landing Camera"
                        }, {
                            "name": "RHAZ",
                            "full_name": "Rear Hazard Avoidance Camera"
                        }]
                    }, {
                        "id": 6,
                        "name": "Opportunity",
                        "landing_date": "2004-01-25",
                        "launch_date": "2003-07-07",
                        "status": "complete",
                        "max_sol": 5111,
                        "max_date": "2018-06-11",
                        "total_photos": 198439,
                        "cameras": [{
                            "name": "FHAZ",
                            "full_name": "Front Hazard Avoidance Camera"
                        }, {
                            "name": "NAVCAM",
                            "full_name": "Navigation Camera"
                        }, {
                            "name": "PANCAM",
                            "full_name": "Panoramic Camera"
                        }, {
                            "name": "MINITES",
                            "full_name": "Miniature Thermal Emission Spectrometer (Mini-TES)"
                        }, {
                            "name": "ENTRY",
                            "full_name": "Entry, Descent, and Landing Camera"
                        }, {
                            "name": "RHAZ",
                            "full_name": "Rear Hazard Avoidance Camera"
                        }]
                    }]
                }


            }



        }
    }

}


class StackedBarChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.seriesHighTotal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;


        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        this.build(options);

        this.masterTransform.position.x = 0;
        this.masterTransform.position.y = 0;

    }

    addBar(elementIndex, seriesIndex, seriesOffset) {

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.depth ? this.options.depth : 10
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        bar.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;

        if (seriesOffset >= 0) {
            bar.position.y = barHeight / 2 + seriesOffset;
            this.stackedHeight[elementIndex] += barHeight;
        }

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];
        bar.userData.material = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                this.gui2D.advancedTexture.removeControl(this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build(barChartOptionsxx) {

        if (this.options.showBackplanes) {

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth + 400,
                height: this.planeHeight + 300
            }, this.scene);
            chartMarginPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartMarginPlane.position.y = this.planeHeight / 2;
            chartMarginPlane.material = this.materials[0];
            chartMarginPlane.position.z = .25;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

            // Add actions to bar
            var actionsObject = {

                OnPointerOverTrigger: () => {
                    // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                    // this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
                    // console.log('mouseOver', bar);
                },

            }

            this.addActions(chartMarginPlane, actionsObject);
            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength + 1; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.padding / 2;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale, this.gui3D);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale * 2,
                -1.75,
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;

        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);

        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;

        this.stackedHeight = []

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            this.stackedHeight[elementIndex] = 0;
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {

                let bar = this.addBar(elementIndex, seriesIndex, this.stackedHeight[elementIndex]);
                bar.parent = this.masterTransform;
                bar.position.x -= this.masterTransform.position.x;
                bar.position.y -= this.masterTransform.position.y;
                bar.position.z -= this.masterTransform.position.z;
            }
        }
    }

    myUpdate() {
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }
}


class BarChart3D extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;
        this.masterTransform.setPivotMatrix(BABYLON.Matrix.Translation(-this.planeWidth / 2, -this.planeHeight / 2, 0));

        this.build(options);

        this.masterTransform.position.x = -this.planeWidth / 2;
        this.masterTransform.position.y = -this.planeHeight / 2;
    }

    addBar(elementIndex, seriesIndex) {

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.barWidth
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        bar.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;
        bar.position.z = seriesIndex * (this.elementWidth + this.padding);

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];
        bar.userData.material = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                this.gui2D.advancedTexture.removeControl(this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build() {

        if (this.options.showBackplanes) {
            var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
                width: this.planeWidth,
                height: this.planeHeight
            }, this.scene);

            chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartPlane.position.y = this.planeHeight / 2;
            this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth + 400,
                height: this.planeHeight + 300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartMarginPlane.position.y = this.planeHeight / 2;
            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength + 1; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.padding / 2;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale * 2,
                -1.75);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;

        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);

        titleText.getMesh().parent = this.masterTransform;

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {

                let bar = this.addBar(elementIndex, seriesIndex);
                bar.parent = this.masterTransform;
            }
        }
    }

    myUpdate() {
        this.masterTransform.rotation.x += .0051;
        this.masterTransform.rotation.y -= .0051;
        this.masterTransform.rotation.z += .0051;
    }
}


class LineChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        this.build(options);

    }

    addPoint(elementIndex, seriesIndex, tubePath) {

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        let point;
        let pointHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // // create the bar
        point = BABYLON.MeshBuilder.CreateSphere("mySphere", {
            diameter: 7
        }, this.scene);

        if (this.seriesCount > 1) {
            point.material = this.materials[seriesIndex + 1];
        } else {
            point.material = this.materials[elementIndex + 1];
        }

        point.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        point.position.y = pointHeight;

        tubePath.push(point.position);

        point.userData = element;
        point.userData.seriesName = this.seriesNames[seriesIndex];
        point.userData.material = this.seriesNames[seriesIndex];

        // Add actions to point
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + point.name)
            },
            OnRightPickTrigger: () => {
                // console.log(point);
                // console.log(this.scene.pointerX);
                // console.log(this.scene.pointerY);

                this.gui2D.menuObjectOptions(point, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                this.hoverPanel = this.gui2D.showObjectValue(point, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                this.gui2D.advancedTexture.removeControl(this.hoverPanel);
            }
        }

        this.addActions(point, actionsObject);

        this.myBars.push(point);

        return point;
    }

    build() {

        if (this.options.showBackplanes) {

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth + 400,
                height: this.planeHeight + 300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartMarginPlane.position.y = this.planeHeight / 2;
            chartMarginPlane.position.z = .25;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

            // Add actions to bar
            var actionsObject = {

                OnPointerOverTrigger: () => {
                    // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                    // this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
                    // console.log('mouseOver', bar);

                },

            }

            this.addActions(chartMarginPlane, actionsObject);


            chartMarginPlane.material = this.materials[0];
            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            // console.log(element);
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale * 2,
                -1.75,
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;

        for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
            let tubePath = [];
            for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {


                let point = this.addPoint(elementIndex, seriesIndex, tubePath);
                point.parent = this.masterTransform;
                point.position.x -= this.masterTransform.position.x;
                point.position.y -= this.masterTransform.position.y;
                point.position.z -= this.masterTransform.position.z;
            }

            for (let index = 0; index < tubePath.length - 1; index++) {
                const element = tubePath[index];

                let tube = BABYLON.MeshBuilder.CreateTube("tube", {
                    path: [element, tubePath[index + 1]]
                }, this.scene);
                tube.parent = this.masterTransform;

                if (this.seriesCount > 1) {
                    tube.material = this.materials[seriesIndex + 1];
                } else {
                    tube.material = this.lineMat;
                }
            }
        }
    }

    myUpdate() {
        // this.masterTransform.rotation.x +=.007;
        // this.masterTransform.rotation.y +=.007;
        // this.masterTransform.rotation.z +=.007;
    }
}


class PieChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        this.parseData();

        this.build();

        if (options.transition) {
            this.moveMe(new BABYLON.Vector3(-400, 0, 0), new BABYLON.Vector3(250, -150, 350), 30, 2);
            this.scaleMe(new BABYLON.Vector3(0.00000001, 0.00000001, 0.00000001), new BABYLON.Vector3(.25, .25, .25), 30, 2);
            this.rotateMeY(0, 6 * Math.PI, 30, 2);
        }
    }

    addPieSlice(options) {
        // X and Y calculations for offset animation
        let offset = 20;
        let height = 50;
        let medianAngle = options.startRotation + Math.PI * options.percent;
        let offsetX = Math.cos(medianAngle) * offset;
        let offsetZ = -Math.sin(medianAngle) * offset;
        let offsetX2 = Math.cos(medianAngle) * 6;
        let offsetZ2 = -Math.sin(medianAngle) * 6;

        // basic settings for a cylinder
        var settings = {
            height: height,
            diameterTop: 500,
            diameterBottom: 500,
            tessellation: 40,
            arc: options.percent, // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces and side caps(planes) f
        var slice1 = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        var myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 250,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane1.position.x = 125;
        var myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 250,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane2.setPivotPoint(new BABYLON.Vector3(-125, 0, 0));
        myPlane2.rotation.y = Math.PI * options.percent * 2;
        myPlane2.position.x = 125;

        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);

        if (options.doughnut) {
            var cylinder = BABYLON.MeshBuilder.CreateCylinder("cone", {
                height: height + 10,
                diameter: 250,
                tessellation: 40,
                arc: options.percent
            }, options.graph);

            let csgSlice = BABYLON.CSG.FromMesh(slice);
            let csgCyl = BABYLON.CSG.FromMesh(cylinder);

            var subCSG = csgSlice.subtract(csgCyl);
            let newSlice = subCSG.toMesh("csg", options.mat, options.graph);
            slice.dispose();
            cylinder.dispose();
            slice = newSlice;
        }

        slice.material = options.mat;
        slice.rotation.y = options.startRotation; // rotation location in pie

        slice.userData = options.element;
        slice.userData.seriesName = this.seriesNames[0];
        slice.userData.material = slice.material;

        /////// Add Actions
        var basePosition = slice.position;

        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + slice.name)
            },
            OnRightPickTrigger: () => {
                this.gui2D.menuObjectOptions(slice, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                this.hoverPanel = this.gui2D.showObjectValue(slice, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                this.gui2D.advancedTexture.removeControl(this.hoverPanel);
            }
        }

        this.addActions(slice, actionsObject);

        slice.actionManager
            .registerAction(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    slice,
                    'position',
                    new BABYLON.Vector3(offsetX, 0, offsetZ),
                    100
                )
            ).then(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.NothingTrigger,
                    slice,
                    'position',
                    basePosition,
                    100
                )
            );

        this.mySlices.push(slice);

        return slice;
    } //  end addPieSlice method

    build() {
        let titleText = this.gui3D.create3DText(this.scene, 6, this.options.titleDepth, this.options.title, 0, 20, -.2, this.lineMat);
        titleText.getMesh().parent = this.masterTransform;

        if (this.options.horizontal) {
            titleText.getMesh().rotation.x = 0;
            titleText.getMesh().rotation.y = -Math.PI / 2;
            titleText.getMesh().position.x = -420;
            titleText.getMesh().position.y = 0;
        }
        this.myTexts.push(titleText);

        let max_label_size = 0;
        let total_value = 0;

        let totalValue = 0;

        this.options.data[this.seriesNames[0]].forEach(element => {
            total_value += element.value;
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

        let me = this;
        let start_angle = 0;


        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            let slice_angle = 2 * Math.PI * element.value / total_value;
            let slice = this.addPieSlice({
                graph: this.scene,
                percent: element.value / total_value,
                startRotation: start_angle,
                mat: me.materials[index + 1],
                name: element.label,
                value: element.value,
                element: element,
                doughnut: this.options.doughnut
            });
            slice.parent = this.masterTransform;


            start_angle += slice_angle;
        });

    } //  end build method

    myUpdate() {
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }
}


class Gauge extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        this.parseData();

        this.build();
    }

    addNeedle(options) {

    }

    addScale(options) {

    }

    createOverlay(start, end, mat) { // % 0-1

        // basic settings for a cylinder
        var settings = {
            height: 20.5,
            diameterTop: 350,
            diameterBottom: 350,
            tessellation: 40,
            arc: remap(end, 0, 100, 0, .5) - remap(start, 0, 100, 0, .5), // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces and side caps(planes) f
        var slice = BABYLON.MeshBuilder.CreateCylinder('test', settings, this.scene);

        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cone", {
            height: 30,
            diameter: 250,
            tessellation: 40,
            arc: remap(end, 0, 100, 0, .5) - remap(start, 0, 100, 0, .5)
        }, this.scene);

        let csgSlice = BABYLON.CSG.FromMesh(slice);
        let csgCyl = BABYLON.CSG.FromMesh(cylinder);

        var subCSG = csgSlice.subtract(csgCyl);
        let newSlice = subCSG.toMesh("csg", mat, this.scene);
        slice.dispose();
        cylinder.dispose();
        slice = newSlice;

        slice.material = mat;

        slice.rotation.y = remap(start, 0, 100, 0, Math.PI)
        slice.rotation.x = -Math.PI
        slice.rotation.z = Math.PI


        return slice;
    }

    build(options) {
        let value = this.options.value;
        let titleText = this.options.title;
        let seriesMaterial = 15;

        // basic settings for a cylinder
        let settings = {
            height: 20,
            diameterTop: 500,
            diameterBottom: 500,
            tessellation: 40,
            arc: .55,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces and side caps(planes) f
        let slice1 = BABYLON.MeshBuilder.CreateCylinder('GuageFace', settings, this.scene);
        slice1.rotation.y = Math.PI - .16;

        settings.height = .01;
        settings.arc = 1;

        let slice2 = BABYLON.MeshBuilder.CreateCylinder('GuageTextArea', settings, this.scene);
        settings.diameterTop = 50;
        settings.diameterBottom = 50;
        settings.height = 35;

        let slice3 = BABYLON.MeshBuilder.CreateCylinder('center', settings, this.scene);

        let torus = BABYLON.MeshBuilder.CreateTorus("OuterRing", {
            thickness: 35,
            diameter: 500,
            tessellation: 64
        }, this.scene);

        slice1.parent = this.masterTransform;
        slice2.parent = this.masterTransform;
        slice3.parent = this.masterTransform;
        slice2.material = this.lineMat;
        slice3.material = this.lineMat;

        torus.parent = this.masterTransform;
        torus.material = this.materials[0];


        let count = 0;
        for (let t = Math.PI; t >= 0; t -= Math.PI / 10) {
            let x = Math.cos(t);
            let z = Math.sin(t);

            let path = [
                new BABYLON.Vector3(175 * x, 38, 175 * z),
                new BABYLON.Vector3(160 * x, 38, 160 * z)
            ];

            let tube = BABYLON.MeshBuilder.CreateTube("tube", {
                path: path,
                radius: 2.5
            }, this.scene);
            tube.material = this.lineMat;
            tube.scaling.y = .4;
            tube.parent = this.masterTransform;

            let scale = 5.8;
            let depth = .01;
            let displayText = (10 * count).toString();
            let xPos = 200 * x / scale;
            let zPos = 195 * z / scale;
            let yPos = 15 / scale;
            let color = this.lineMat;


            let text = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().rotation.x = 0;

            count++;
        }

        let scale = 8.8;
        let depth = 1;
        let displayText = value + '%';
        let xPos = 0;
        let zPos = -150 / scale;
        let yPos = 10 / scale;
        let color = this.materials[this.options.materialIndex];


        let text = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
        text.getMesh().parent = this.masterTransform;
        text.getMesh().rotation.x = 0;


        scale = 8.8;
        depth = .01;
        displayText = titleText;
        xPos = 0;
        zPos = 300 / scale;
        yPos = 1 / scale;
        color = this.materials[0];


        let title = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
        title.getMesh().parent = this.masterTransform;
        title.getMesh().rotation.x = 0;



        let theta = remap(value, 0, 100, Math.PI, 0)
        let px = Math.cos(theta);
        let pz = Math.sin(theta);

        let path = [
            new BABYLON.Vector3(0, 35, 0),
            new BABYLON.Vector3(250 * px, 13, 250 * pz)
        ];

        let tube = BABYLON.MeshBuilder.CreateTube("needle", {
            path: path,
            radius: 12.8
        }, this.scene);
        tube.material = this.materials[this.options.materialIndex];
        tube.scaling.y = .34;

        tube.parent = this.masterTransform;

        this.masterTransform.rotation.x = -Math.PI / 2;

    }

    myUpdate() {}

}


class Gauge2 extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        this.parseData();

        this.build();
    }

    addNeedle(options) {

    }

    addScale(options) {

    }

    createOverlay(start, end, mat) { // % 0-1

        // basic settings for a cylinder
        var settings = {
            height: 40,
            diameterTop: 350,
            diameterBottom: 350,
            tessellation: 40,
            arc: remap(end, 0, 100, 0, .5) - remap(start, 0, 100, 0, .5), // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces and side caps(planes) f
        var slice = BABYLON.MeshBuilder.CreateCylinder('test', settings, this.scene);

        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cone", {
            height: 43,
            diameter: 250,
            tessellation: 40,
            arc: remap(end, 0, 100, 0, .5) - remap(start, 0, 100, 0, .5)
        }, this.scene);

        let csgSlice = BABYLON.CSG.FromMesh(slice);
        let csgCyl = BABYLON.CSG.FromMesh(cylinder);

        var subCSG = csgSlice.subtract(csgCyl);
        let newSlice = subCSG.toMesh("csg", mat, this.scene);
        slice.dispose();
        cylinder.dispose();
        slice = newSlice;

        slice.material = mat;

        slice.rotation.y = remap(start, 0, 100, 0, Math.PI)
        slice.rotation.x = -Math.PI
        slice.rotation.z = Math.PI
        slice.position.y = 15;

        return slice;
    }

    build(options) {
        let value = this.options.value;
        let titleText = this.options.title;

        // basic settings for a cylinder
        let settings = {
            height: 35,
            diameterTop: 50,
            diameterBottom: 50,
            tessellation: 40,
            arc: 1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        let centerNub = BABYLON.MeshBuilder.CreateCylinder('center', settings, this.scene);
        centerNub.position.y = 15;
        centerNub.parent = this.masterTransform;
        centerNub.material = this.lineMat;

        let count = 0;
        for (let t = Math.PI; t >= 0; t -= Math.PI / 10) {
            let x = Math.cos(t);
            let z = Math.sin(t);

            let path = [
                new BABYLON.Vector3(175 * x, 38, 175 * z),
                new BABYLON.Vector3(160 * x, 38, 160 * z)
            ];

            let tube = BABYLON.MeshBuilder.CreateTube("tube", {
                path: path,
                radius: 2.5
            }, this.scene);
            tube.material = this.lineMat;
            tube.scaling.y = .4;
            tube.parent = this.masterTransform;

            let scale = 5.8;
            let depth = .01;
            let displayText = (10 * count).toString();
            let xPos = 200 * x / scale;
            let zPos = 195 * z / scale;
            let yPos = 15 / scale;
            let color = this.lineMat;


            let text = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().rotation.x = 0;

            count++;
        }

        let scale = 8.8;
        let depth = 1;
        let displayText = value + '%';
        let xPos = 0;
        let zPos = -150 / scale;
        let yPos = 10 / scale;
        let color = this.materials[this.options.materialIndex];


        let text = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
        text.getMesh().parent = this.masterTransform;
        text.getMesh().rotation.x = 0;


        scale = 8.8;
        depth = .01;
        displayText = titleText;
        xPos = 0;
        zPos = 300 / scale;
        yPos = 1 / scale;
        color = this.materials[0];


        let title = this.gui3D.create3DText(this.scene, scale, depth, displayText, xPos, yPos, zPos, color);
        title.getMesh().parent = this.masterTransform;
        title.getMesh().rotation.x = 0;



        let theta = remap(value, 0, 100, Math.PI, 0)
        let px = Math.cos(theta);
        let pz = Math.sin(theta);

        let path = [
            new BABYLON.Vector3(0, 25, 0),
            new BABYLON.Vector3(250 * px, 15, 250 * pz)
        ];

        let tube = BABYLON.MeshBuilder.CreateTube("arrow", {
            path: path,
            radius: 6.8
        }, this.scene);
        tube.material = this.materials[this.options.materialIndex];
        tube.scaling.y = .4;

        tube.parent = this.masterTransform;

        let oMat1 = new BABYLON.StandardMaterial("oMat1", this.scene);
        oMat1.diffuseColor = new BABYLON.Color3(1, 0, 0);
        oMat1.specularColor = new BABYLON.Color3(.5, 0, 0);
        oMat1.alpha = .5;

        let oMat2 = new BABYLON.StandardMaterial("oMat2", this.scene);
        oMat2.diffuseColor = new BABYLON.Color3(0, 1, 0);
        oMat2.specularColor = new BABYLON.Color3(0, .5, 0);
        oMat2.alpha = .5;

        let oMat3 = new BABYLON.StandardMaterial("oMat3", this.scene);
        oMat3.diffuseColor = new BABYLON.Color3(1, 1, 0);
        oMat3.specularColor = new BABYLON.Color3(.5, .5, 0);
        oMat3.alpha = .5;

        let overlay1 = this.createOverlay(0, 25, oMat1);
        overlay1.parent = this.masterTransform;

        let overlay2 = this.createOverlay(75, 100, oMat2);
        overlay2.parent = this.masterTransform;

        let overlay3 = this.createOverlay(25, 75, oMat3);
        overlay3.parent = this.masterTransform;



        this.masterTransform.rotation.x = -Math.PI / 2;
    }

    myUpdate() {}

}


class AreaChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        this.build(options);

    }

    addPoint(elementIndex, seriesIndex, shapePoints) {

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        let position = new BABYLON.Vector3();
        let pointHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        position.z = pointHeight;

        shapePoints.push(position);
    }

    build() {

        if (this.options.showBackplanes) {

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth + 400,
                height: this.planeHeight + 300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartMarginPlane.position.y = this.planeHeight / 2;
            chartMarginPlane.position.z = .25;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

            // Add actions to bar
            var actionsObject = {

                OnPointerOverTrigger: () => {
                    // empty function to block event from passing through backplane
                },

            }

            this.addActions(chartMarginPlane, actionsObject);

            chartMarginPlane.material = this.materials[0];
            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale * 2,
                -1.75,
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;

        for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
            let shapePoints = [];
            shapePoints.push(new BABYLON.Vector3(this.barWidth / 2 + this.padding, 0, 0));

            for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
                this.addPoint(elementIndex, seriesIndex, shapePoints);
            }

            var holes = [];
            shapePoints.push(new BABYLON.Vector3((this.seriesLength - 1) * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding, 0, 0));

            shapePoints.reverse();
            var polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {
                shape: shapePoints,
                holes: holes,
                depth: this.options.depth,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE
            }, this.scene);
            polygon.material = this.materials[seriesIndex + 2];
            polygon.position.z += (seriesIndex + .01) * this.options.depth;

            polygon.rotation.x = -Math.PI / 2;

            polygon.parent = this.masterTransform;
            polygon.position.x -= this.masterTransform.position.x;
            polygon.position.y -= this.masterTransform.position.y;
            polygon.position.z -= this.masterTransform.position.z;
        }
    }

    myUpdate() {
        // this.masterTransform.rotation.x +=.007;
        // this.masterTransform.rotation.y +=.007;
        // this.masterTransform.rotation.z +=.007;
    }
}

export {
    ChartSceneManager
};