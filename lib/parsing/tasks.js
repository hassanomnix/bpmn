/**
 * AUTHOR: mrassinger
 * COPYRIGHT: E2E Technologies Ltd.
 */

var nodeUtilsModule = require('util');
var parserUtilsModule = require("./parserUtils");
var BPMNActivity = require("./activity.js").BPMNActivity;


/**
 * @param node
 * @constructor
 */
exports.createBPMNTask = function(node) {
    var getValue = parserUtilsModule.getAttributesValue;
    return (new BPMNTask(
        getValue(node, "id"),
        getValue(node, "name"),
        node.local
    ));
};

/**
 * @param localName name without namespace prefix
 * @return {Boolean}
 */
exports.isTaskName = function(localName) {
    return (localName.toLowerCase().indexOf("task") > -1);
};

nodeUtilsModule.inherits(BPMNTask, BPMNActivity);
/**
 * Subsumes all kind of tasks
 * @param {String} bpmnId
 * @param {String} name
 * @param {String} type
 * @constructor
 */
function BPMNTask(bpmnId, name, type) {
    BPMNActivity.call(this, bpmnId, name, type);
    this.isWaitTask = type == 'task' || type == 'userTask' || type == 'receiveTask' || type == 'manualTask';
}
exports.BPMNTask = BPMNTask;

/**
 * @param {BPMNProcessDefinition} processDefinition
 * @param {ErrorQueue} errorQueue
 */
BPMNTask.prototype.validate = function(processDefinition, errorQueue) {
    this.assertName(errorQueue);
    this.assertIncomingSequenceFlows(processDefinition, errorQueue);
    this.assertOutgoingSequenceFlows(processDefinition, errorQueue);
};