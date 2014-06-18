"""
Troposphere version.
"""
from dateutil import parser
from os.path import abspath, dirname
from subprocess import Popen, PIPE


VERSION = (0, 2, 0, 'dev', 0)


def git_info():
    loc = abspath(dirname(__file__))
    try:
        p = Popen(
            "cd \"%s\" && git log -1 --format=format:%%H%%ci" % loc,
            shell=True,
            stdout=PIPE,
            stderr=PIPE
        )
        return p.communicate()[0]
    except OSError:
        return None


def git_branch():
    loc = abspath(dirname(__file__))
    try:
        p = Popen(
            "cd \"%s\" && git "
            "rev-parse --symbolic-full-name --abbrev-ref HEAD" % loc,
            shell=True,
            stdout=PIPE,
            stderr=PIPE)
        return p.communicate()[0].replace("\n", "")
    except OSError:
        return None


def get_version():
    """
    Returns a dictionary with the full git sha, the abbreviated
    git_sha, the git branch and the commit date.
    """
    versions = {}
    info = git_info()
    versions["git_sha"] = info[0:39]
    versions["git_sha_abbrev"] = "@" + info[0:6]
    versions["git_branch"] = git_branch()
    versions["commit_date"] = parser.parse(info[40:])
    return versions
