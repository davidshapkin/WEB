new Vue({
    el: '#board',
    data: {

        tasks: [
            {task_id: 0},
            {date_start: ""},
            {date_end: ""},
            {status: ""},
            {time_wasted: ""}
        ],
        newTaskName: '',
        newWorker: '',
        messageError: '',
        counter: 0,
        begin: 0,
        end: 0,
        nextId: 1,
        task_name_r: "",
        worker_r: "",
        date_start_r: "",
        date_end_r: "",
        status_r: "",
        saved_task_id: "",
        isShowTR: false,
        darkTheme: false
    },
    computed: {
        tasksOpen: function () {
            return filters.open(this.tasks)
        },
        tasksDoing: function () {
            return filters.doing(this.tasks)
        },
        tasksClosed: function () {
            return filters.closed(this.tasks)
        }
    },
    var: filters = {
        open: function (tasks) {
            return tasks.filter(function (task) {
                return task.status === 1
            });
        },
        doing: function (tasks) {
            return tasks.filter(function (task) {
                return task.status === 2
            });
        },
        closed: function (tasks) {
            return tasks.filter(function (task) {
                return task.status === 3
            });
        }
    },
    methods: {
        drop(task) {
            if (task.status == 1) {
                task.status = "deleted";
                this.counter--;
            }
            if (task.status == 2) {
                task.status = "deleted";
                this.begin--;
            }
            if (task.status == 3) {
                task.status = "deleted";
                this.end--;
            }


        },
        draggable: (evt, task) => {
            evt.dataTransfer.dropEffect = "move"
            evt.dataTransfer.effectAllowed = "move"
            evt.dataTransfer.setData("task", task.task_id)


        },
        openTaskRedactor(task) {
            this.saved_task_id = task.task_id
            this.task_name_r = task.name
            this.worker_r = task.worker
            this.date_start_r = task.date_start
            this.status_r = task.status
            this.date_end_r = task.date_end
            this.isShowTR = true
        },
        nullify() {
            this.task_name_r = ""
            this.worker_r = ""
            this.date_start_r = ""
            this.status_r = ""
            this.date_end_r = ""
        },

        redactTask() {
            const card_info = this.tasks.find(task => task.task_id == this.saved_task_id)
            if (this.status_r == "end") {
                if (card_info.status == 1) {
                    this.date_start_r = new Date().toLocaleString()
                    this.date_end_r = new Date().toLocaleString()
                    this.worker_r = card_info.worker
                    this.counter--;
                    this.end++;
                }
                if (card_info.status == 2) {
                    this.date_end_r = new Date().toLocaleString()
                    this.begin--;
                    this.end++;
                }
                if (this.task_name_r != "" && this.date_end_r != "" && this.date_start_r != "" && this.worker_r != "") {
                    var end_date = this.date_end_r.trim().split(/\.|,|:/)
                    var start_date = this.date_start_r.trim().split(/\.|,|:/)
                    var end_date_d = new Date(end_date[2], end_date[1] - 1, end_date[0], end_date[3], end_date[4], end_date[5])
                    var start_date_d = new Date(start_date[2], start_date[1] - 1, start_date[0], start_date[3], start_date[4], start_date[5])
                    if (!isNaN(end_date_d) && !isNaN(start_date_d) && end_date_d >= start_date_d) {
                        card_info.status = 3
                        card_info.date_start = this.date_start_r
                        card_info.date_end = this.date_end_r
                        card_info.worker = this.worker_r
                        card_info.name = this.task_name_r
                        var millis = end_date_d - start_date_d
                        var sec = (millis / 1000) % 60
                        var min = (millis / (1000 * 60)) % 60
                        var hours = (millis / (1000 * 60 * 60)) % 24
                        var days = millis / (1000 * 60 * 60 * 24)
                        card_info.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)
                        this.nullify()
                        this.isShowTR = false
                    }
                }
            } else if (this.status_r == "begin") {
                if (card_info.status == 1) {
                    this.date_start_r = new Date().toLocaleString()
                    this.worker_r = card_info.worker
                    this.counter--;
                    this.begin++;
                } else {
                    this.begin++;
                    this.end--;
                }
                if (this.task_name_r != "" && this.date_start_r != "" && this.worker_r != "") {

                    var start_date = this.date_start_r.trim().split(/\.|,|:/)
                    var start_date_d = new Date(start_date[2], start_date[1] - 1, start_date[0], start_date[3], start_date[4], start_date[5])
                    if (!isNaN(start_date_d)) {
                        card_info.status = 2
                        card_info.date_start = this.date_start_r
                        card_info.worker = this.worker_r
                        card_info.name = this.task_name_r
                        this.nullify()
                        this.isShowTR = false
                    }
                }
            } else if (this.status_r == "plan") {
                if (card_info.status == 3) {
                    this.end--;
                    this.counter++;
                }
                if (card_info.status == 2) {
                    this.begin--;
                    this.counter++;
                }
                if (this.task_name_r != "") {
                    card_info.status = 1
                    card_info.name = this.task_name_r
                    this.nullify()
                    this.isShowTR = false
                }
            }
        },

        onDrop(evt, num) {
            const itemID = evt.dataTransfer.getData("task")
            const card_info = this.tasks.find(task => task.task_id == itemID)
            if (card_info.status == 1) {
                this.counter--;
            } else if (card_info.status == 2) {
                this.begin--;
            } else {
                this.end--;
            }
            if (num == 1) {
                card_info.status = 1
                this.counter++;
            } else if (num == 2) {
                card_info.date_start = new Date().toLocaleString()
                card_info.status = 2
                this.begin++;
            } else {
                if (card_info.date_start == "") {
                    card_info.date_start = new Date().toLocaleString()
                }
                card_info.date_end = new Date().toLocaleString()
                var end_date = card_info.date_end.trim().split(/\.|,|:/)
                var start_date = card_info.date_start.trim().split(/\.|,|:/)
                var end_date_d = new Date(end_date[2], end_date[1] - 1, end_date[0], end_date[3], end_date[4], end_date[5])
                var start_date_d = new Date(start_date[2], start_date[1] - 1, start_date[0], start_date[3], start_date[4], start_date[5])
                var millis = end_date_d - start_date_d
                var sec = (millis / 1000) % 60
                var min = (millis / (1000 * 60)) % 60
                var hours = (millis / (1000 * 60 * 60)) % 24
                var days = millis / (1000 * 60 * 60 * 24)
                if (millis < 0) {
                    sec = 0
                    min = 0
                    hours = 0
                    days = 0
                }
                card_info.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)
                card_info.status = 3
                this.end++;
            }
        },

        addTask() {
            if (this.newTaskName != "" && this.newWorker != "") {
                this.tasks.push({task_id: this.nextId, name: this.newTaskName, status: 1, worker: this.newWorker})
                this.messageError = ''
                this.counter++;
                this.nextId++;
            } else
                this.messageError = 'Заполните все поля!'
        },
        incrementStatus: function (task) {
            if (1 == task.status || task.status == 2) {

                if (task.status == 1) {
                    this.counter--;
                    this.begin++;
                    task.date_start = new Date().toLocaleString()
                }
                if (task.status == 2) {
                    this.end++;
                    this.begin--;
                    if (task.date_start == "") {
                        task.date_start = new Date().toLocaleString()
                    }
                    task.date_end = new Date().toLocaleString()
                    var end_date = task.date_end.trim().split(/\.|,|:/)
                    var start_date = task.date_start.trim().split(/\.|,|:/)
                    var end_date_d = new Date(end_date[2], end_date[1] - 1, end_date[0], end_date[3], end_date[4], end_date[5])
                    var start_date_d = new Date(start_date[2], start_date[1] - 1, start_date[0], start_date[3], start_date[4], start_date[5])
                    var millis = end_date_d - start_date_d
                    var sec = (millis / 1000) % 60
                    var min = (millis / (1000 * 60)) % 60
                    var hours = (millis / (1000 * 60 * 60)) % 24
                    var days = millis / (1000 * 60 * 60 * 24)
                    if (millis < 0) {
                        sec = 0
                        min = 0
                        hours = 0
                        days = 0
                    }
                    task.time_wasted = "Дней: " + Math.trunc(days) + " Часов: " + Math.trunc(hours) + " Минут: " + Math.trunc(min) + " Секунд: " + Math.trunc(sec)

                }
                task.status++
            }
        },
        decrementStatus: function (task) {
            if (2 == task.status || task.status == 3) {

                if (task.status == 2) {
                    this.counter++;
                    this.begin--;
                }
                if (task.status == 3) {
                    this.end--;
                    this.begin++;
                }
                task.status--
            }
        }
    }
});
