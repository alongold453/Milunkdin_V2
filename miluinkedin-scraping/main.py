from reservists import getAllReservists
from track import track
from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()
@sched.scheduled_job('interval', days=1)
def main():
    reservists = getAllReservists()
    for reservist in reservists:
        track(reservist["linkedin_name"], reservist["id"])
sched.start()



# if __name__ == "__main__":
#     main()
